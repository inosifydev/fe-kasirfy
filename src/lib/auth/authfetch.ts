import { clearAccessToken, getAccessToken, setAccessToken } from './token';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface RefreshApiResponse {
  success: boolean;
  status: number;
  message: string;
  data?: {
    access_token?: string;
  };
}

/**
 * =========================================================
 * REFRESH STATE
 * =========================================================
 *
 * Mencegah beberapa request melakukan refresh token secara
 * bersamaan.
 *
 * Request A -> 401
 * Request B -> 401
 * Request C -> 401
 *
 * Hanya 1 request refresh yang dikirim; A, B, C menunggu
 * hasil refresh yang sama.
 */

let refreshPromise: Promise<string | null> | null = null;

export async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const response = await fetch(`${API_URL}/v1/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // refresh_token cookie ikut dikirim
        cache: 'no-store',
      });

      if (!response.ok) {
        clearAccessToken();
        return null;
      }

      const result: RefreshApiResponse = await response.json();
      if (!result.success || !result.data?.access_token) {
        clearAccessToken();
        return null;
      }

      const newAccessToken = result.data.access_token;
      setAccessToken(newAccessToken);
      return newAccessToken;
    } catch (error) {
      console.error('[Auth] Refresh access token error:', error);
      clearAccessToken();
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

/**
 * =========================================================
 * AUTH FETCH
 * =========================================================
 *
 * Semua request API yang butuh login sebaiknya pakai
 * authFetch().
 *
 * 1. Menambahkan Authorization Bearer.
 * 2. credentials: include.
 * 3. Jika 401 -> refresh token, lalu request diulang sekali
 *    dengan access token baru.
 */
export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const headers = new Headers(options.headers);
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const token = getAccessToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
    cache: 'no-store',
  });

  if (response.status === 401) {
    const newAccessToken = await refreshAccessToken();

    // Refresh gagal — jangan retry, kembalikan response 401 asli
    if (!newAccessToken) {
      return response;
    }

    const retryHeaders = new Headers(options.headers);
    if (!retryHeaders.has('Content-Type')) {
      retryHeaders.set('Content-Type', 'application/json');
    }
    retryHeaders.set('Authorization', `Bearer ${newAccessToken}`);

    response = await fetch(url, {
      ...options,
      headers: retryHeaders,
      credentials: 'include',
      cache: 'no-store',
    });
  }

  return response;
}