// The single auth-aware fetch wrapper every admin call goes through.
//   • attaches the in-memory Bearer access token
//   • sends the httpOnly refresh cookie (credentials: 'include')
//   • on a 401, silently rotates via POST /admin/auth/refresh once, then retries
// Never computes anything about money — it just transports JSON (admin-panel
// CLAUDE.md → "never compute money client-side").

import { clearAccessToken, getAccessToken, setAccessToken } from './tokenStore';

export const API_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api';

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly body?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

function messageFrom(body: unknown, status: number): string {
  if (body && typeof body === 'object' && 'message' in body) {
    const m = (body as { message: unknown }).message;
    if (Array.isArray(m)) return m.join(', ');
    if (typeof m === 'string') return m;
  }
  return `HTTP ${status}`;
}

async function rawFetch(path: string, init: RequestInit): Promise<Response> {
  const headers = new Headers(init.headers);
  headers.set('Accept', 'application/json');
  const isForm = init.body instanceof FormData;
  if (init.body !== undefined && !isForm && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  const token = getAccessToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);
  return fetch(`${API_URL}${path}`, { ...init, headers, credentials: 'include' });
}

// De-duplicate concurrent refreshes — many parallel 401s share one rotation.
let refreshing: Promise<boolean> | null = null;

export function refreshAccessToken(): Promise<boolean> {
  if (!refreshing) {
    refreshing = (async () => {
      const res = await fetch(`${API_URL}/admin/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) {
        clearAccessToken();
        return false;
      }
      const data = (await res.json()) as { accessToken: string };
      setAccessToken(data.accessToken);
      return true;
    })().finally(() => {
      refreshing = null;
    });
  }
  return refreshing;
}

export async function apiFetch<T>(path: string, init: RequestInit = {}, allowRetry = true): Promise<T> {
  let res = await rawFetch(path, init);

  if (res.status === 401 && allowRetry) {
    const rotated = await refreshAccessToken();
    if (rotated) res = await rawFetch(path, init);
  }

  if (!res.ok) {
    const body = await res.json().catch(() => undefined);
    throw new ApiError(res.status, messageFrom(body, res.status), body);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}
