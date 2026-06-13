import type { AuthProvider } from '@refinedev/core';

// Phase 0 STUB auth — no real backend authentication yet.
// Any login succeeds and sets a local flag so the route guard works and the
// login -> dashboard -> logout flow is demonstrable. Phase 2 replaces this with
// the real JWT access + opaque refresh flow (see docs/contracts.md -> Auth).
const STORAGE_KEY = 'tezbozor-admin-auth';

export const authProvider: AuthProvider = {
  login: async () => {
    localStorage.setItem(STORAGE_KEY, 'stub');
    return { success: true, redirectTo: '/' };
  },
  logout: async () => {
    localStorage.removeItem(STORAGE_KEY);
    return { success: true, redirectTo: '/login' };
  },
  check: async () =>
    localStorage.getItem(STORAGE_KEY)
      ? { authenticated: true }
      : { authenticated: false, redirectTo: '/login' },
  getIdentity: async () => ({ id: 1, name: 'Operator' }),
  onError: async () => ({}),
};
