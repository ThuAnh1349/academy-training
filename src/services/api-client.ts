import { supabase } from '../lib/supabase';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

class ApiError extends Error {
  status: number;
  code?: string;

  constructor(status: number, message: string, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

// Lấy access token từ Supabase session được cache trong memory (KHÔNG network call)
// supabase.auth.getSession() có thể trigger network refresh, dùng _session internal cache
async function getAccessToken(): Promise<string | null> {
  try {
    // Dùng getSession() nhưng với race condition để tránh treo
    const result = await Promise.race([
      supabase.auth.getSession(),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 2000)),
    ]);

    if (!result) {
      console.warn('[apiClient] getSession timed out, proceeding without token');
      return null;
    }

    const r = result as Awaited<ReturnType<typeof supabase.auth.getSession>>;
    return r?.data?.session?.access_token ?? null;
  } catch {
    return null;
  }
}

// getAuthHeaders is removed as it's no longer used

async function handleResponse(response: Response) {
  if (response.ok) {
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  }

  if (response.status === 401) {
    throw new ApiError(401, 'Unauthorized');
  }

  if (response.status === 403) {
    throw new ApiError(403, 'Forbidden');
  }

  const errorData = await response.json().catch(() => ({}));
  throw new ApiError(response.status, errorData.message || errorData.error || 'API Error', errorData.code || errorData.error);
}

// Cho phép AuthContext cung cấp token trực tiếp (bypass getSession delay)
let _cachedToken: string | null = null;

export function setApiToken(token: string | null) {
  _cachedToken = token;
}

async function getAuthHeadersFast(): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Dùng cached token nếu có (được set bởi AuthContext ngay khi nhận session)
  const token = _cachedToken ?? await getAccessToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

export const apiClient = {
  async get<T>(path: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'GET',
      headers: await getAuthHeadersFast(),
    });
    return handleResponse(response);
  },

  async post<T>(path: string, body?: any): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: await getAuthHeadersFast(),
      body: body ? JSON.stringify(body) : undefined,
    });
    return handleResponse(response);
  },

  async patch<T>(path: string, body: any): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'PATCH',
      headers: await getAuthHeadersFast(),
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  },

  async delete<T>(path: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'DELETE',
      headers: await getAuthHeadersFast(),
    });
    return handleResponse(response);
  },

  async upload<T>(path: string, formData: FormData): Promise<T> {
    const headers = await getAuthHeadersFast();
    delete headers['Content-Type']; // Let browser set boundary

    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers,
      body: formData,
    });
    return handleResponse(response);
  }
};
