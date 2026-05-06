import React, { useState } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const LoginPage: React.FC = () => {
  const { isAuthenticated, user, signInWithGoogle, signInWithPassword } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (isAuthenticated && user) {
    const defaultUrl = user.role === 'admin' ? '/admin' : '/';
    const returnUrl = location.state?.returnUrl || defaultUrl;
    return <Navigate to={returnUrl} replace />;
  }

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Đăng nhập thất bại');
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    try {
      setLoading(true);
      setError('');
      await signInWithPassword(email, password);
    } catch (err: any) {
      setError(err.message || 'Email hoặc mật khẩu không đúng');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#F4F2FA',
      fontFamily: "'Nunito', sans-serif",
    }}>
      <div style={{
        width: '100%',
        maxWidth: '380px',
        margin: '0 16px',
        background: '#fff',
        borderRadius: '20px',
        padding: '40px 32px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
      }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '1.8rem',
            fontWeight: 900,
            background: 'linear-gradient(135deg, #FF6B35, #F7931E)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Academy.nlt
          </div>
          <div style={{ fontSize: '13px', color: '#9A96B0', fontWeight: 600, marginTop: '4px' }}>
            Đăng nhập để tiếp tục
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: '#FEF0EB',
            border: '1px solid #FFB8A0',
            color: '#B03A18',
            padding: '10px 14px',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: 700,
            marginBottom: '20px',
          }}>
            {error}
          </div>
        )}

        {/* Google */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            padding: '12px',
            background: '#fff',
            border: '1.5px solid #E0E0E0',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: 800,
            color: '#1A1520',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
            marginBottom: '16px',
            fontFamily: 'inherit',
            transition: 'border-color 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = '#FF6B35')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = '#E0E0E0')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Đăng nhập với Google
        </button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{ flex: 1, height: '1px', background: '#E8E6F0' }} />
          <span style={{ fontSize: '12px', color: '#9A96B0', fontWeight: 700 }}>hoặc</span>
          <div style={{ flex: 1, height: '1px', background: '#E8E6F0' }} />
        </div>

        {/* Email form */}
        <form onSubmit={handleLogin}>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email của bạn"
            style={{
              width: '100%',
              padding: '12px 14px',
              border: '1.5px solid #E0E0E0',
              borderRadius: '12px',
              fontSize: '14px',
              fontFamily: 'inherit',
              fontWeight: 600,
              color: '#1A1520',
              outline: 'none',
              marginBottom: '12px',
              boxSizing: 'border-box',
              transition: 'border-color 0.15s',
            }}
            onFocus={e => (e.target.style.borderColor = '#FF6B35')}
            onBlur={e => (e.target.style.borderColor = '#E0E0E0')}
          />
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Mật khẩu"
            style={{
              width: '100%',
              padding: '12px 14px',
              border: '1.5px solid #E0E0E0',
              borderRadius: '12px',
              fontSize: '14px',
              fontFamily: 'inherit',
              fontWeight: 600,
              color: '#1A1520',
              outline: 'none',
              marginBottom: '16px',
              boxSizing: 'border-box',
              transition: 'border-color 0.15s',
            }}
            onFocus={e => (e.target.style.borderColor = '#FF6B35')}
            onBlur={e => (e.target.style.borderColor = '#E0E0E0')}
          />
          <button
            type="submit"
            disabled={loading || !email || !password}
            style={{
              width: '100%',
              padding: '13px',
              background: loading || !email || !password ? '#E8E6F0' : 'linear-gradient(135deg, #FF6B35, #F7931E)',
              color: loading || !email || !password ? '#9A96B0' : '#fff',
              border: 'none',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: 900,
              fontFamily: 'inherit',
              cursor: loading || !email || !password ? 'not-allowed' : 'pointer',
              transition: 'opacity 0.15s',
            }}
          >
            {loading ? 'Đang xử lý...' : 'Đăng nhập →'}
          </button>
        </form>
      </div>
    </div>
  );
};
