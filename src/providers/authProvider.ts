import type { AuthProvider } from '@refinedev/core';
import { ApiError, apiFetch, refreshAccessToken } from '../api/http';
import { clearAccessToken, getAccessToken, setAccessToken } from '../api/tokenStore';
import { text } from '../i18n/uz';

// Real admin auth (docs/contracts.md → Auth): POST /admin/auth/login returns a
// short-lived access token (kept in memory) and sets the httpOnly refresh cookie.
// check() silently re-mints the access token from the cookie after a reload; the
// apiFetch 401 interceptor rotates it during a session. logout revokes server-side.
export const authProvider: AuthProvider = {
  login: async ({ username, password }) => {
    try {
      // allowRetry=false: a 401 here means bad credentials, not an expired token.
      const { accessToken } = await apiFetch<{ accessToken: string }>(
        '/admin/auth/login',
        { method: 'POST', body: JSON.stringify({ username, password }) },
        false,
      );
      setAccessToken(accessToken);
      return { success: true, redirectTo: '/' };
    } catch {
      return {
        success: false,
        error: { name: text.auth.failedTitle, message: text.auth.failedMessage },
      };
    }
  },

  logout: async () => {
    try {
      await apiFetch('/admin/auth/logout', { method: 'POST' }, false);
    } catch {
      /* clearing the local token below is enough even if the revoke call fails */
    }
    clearAccessToken();
    return { success: true, redirectTo: '/login' };
  },

  check: async () => {
    if (getAccessToken()) return { authenticated: true };
    // No in-memory token (e.g. after a reload) — try the refresh cookie.
    const rotated = await refreshAccessToken();
    return rotated ? { authenticated: true } : { authenticated: false, redirectTo: '/login' };
  },

  getIdentity: async () => {
    try {
      const me = await apiFetch<{ id: number; username: string }>('/admin/auth/me');
      return { id: me.id, name: me.username };
    } catch {
      return null;
    }
  },

  onError: async (error) => {
    if (error instanceof ApiError && error.status === 401) {
      return { logout: true, redirectTo: '/login', error };
    }
    return {};
  },
};
