import { API_URL } from '../api/http';

// Product image URLs are stored server-relative (e.g. /uploads/ab12.jpg) and
// served by the API host, NOT under the /api prefix — so strip /api to build the
// display URL. Absolute URLs (future/external) pass through unchanged.
export function assetUrl(path: string | null | undefined): string | undefined {
  if (!path) return undefined;
  if (/^https?:\/\//.test(path)) return path;
  return `${API_URL.replace(/\/api\/?$/, '')}${path}`;
}
