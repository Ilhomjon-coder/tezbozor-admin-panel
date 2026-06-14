// The admin access token lives ONLY in memory (never localStorage) per
// docs/contracts.md → Auth: short-lived JWT access + httpOnly refresh cookie.
// A page reload drops it; check()/the 401 interceptor silently re-mint it from
// the refresh cookie. Keeping it out of storage limits XSS token theft.

let accessToken: string | null = null;

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

export function clearAccessToken(): void {
  accessToken = null;
}
