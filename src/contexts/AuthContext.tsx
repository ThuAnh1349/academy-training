import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { apiClient, setApiToken } from '../services/api-client';

interface User {
  id: string;
  email: string;
  display_name: string;
  avatar_url?: string;
  role: 'admin' | 'member';
  user_type: 'internal' | 'community';
  total_xp: number;
  current_streak_days: number;
  current_level?: number;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithOTP: (email: string) => Promise<void>;
  verifyOTP: (email: string, token: string) => Promise<void>;
  signInWithPassword: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper: fetch với timeout để tránh hang vô hạn
async function syncUserWithTimeout(timeoutMs = 8000): Promise<User | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const userData = await apiClient.post<User>('/auth/sync-user');
    clearTimeout(timer);
    return userData;
  } catch (err: any) {
    clearTimeout(timer);
    if (err.name === 'AbortError') {
      console.warn('[AuthContext] syncUser timed out after', timeoutMs, 'ms');
    } else {
      console.error('[AuthContext] syncUser failed:', err.message || err);
    }
    return null;
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('[AuthContext] Initializing...');
    let isMounted = true;

    // Safety net: bất kể điều gì xảy ra, sau 10s phải stop loading
    const hardTimeout = setTimeout(() => {
      if (isMounted) {
        console.warn('[AuthContext] Hard timeout hit — forcing isLoading=false');
        setIsLoading(false);
      }
    }, 10000);

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      console.log(`[AuthContext] Event: ${event}`, session ? '✅ session' : '❌ no session');

      if (event === 'SIGNED_OUT') {
        clearTimeout(hardTimeout);
        setApiToken(null); // Xoá cached token
        setUser(null);
        setIsLoading(false);
        window.location.href = '/login';
        return;
      }

      if (!session) {
        // Không có session → chuyển về login
        clearTimeout(hardTimeout);
        setUser(null);
        setIsLoading(false);
        return;
      }

      // Có session → cache token ngay để apiClient dùng được liền
      setApiToken(session.access_token);

      // Có session và event là SIGNED_IN hoặc INITIAL_SESSION → sync user
      if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
        console.log('[AuthContext] Syncing user with backend...');
        const userData = await syncUserWithTimeout(8000);
        clearTimeout(hardTimeout);
        if (isMounted) {
          if (userData) setUser(userData);
          setIsLoading(false);
        }
        return;
      }

      // TOKEN_REFRESHED → cập nhật token mới rồi stop loading
      if (event === 'TOKEN_REFRESHED') {
        clearTimeout(hardTimeout);
        if (isMounted) setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
      clearTimeout(hardTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  };

  const signInWithOTP = async (email: string) => {
    await supabase.auth.signInWithOtp({ email });
  };

  const verifyOTP = async (email: string, token: string) => {
    await supabase.auth.verifyOtp({ email, token, type: 'email' });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const signInWithPassword = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    signInWithGoogle,
    signInWithOTP,
    verifyOTP,
    signInWithPassword,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
