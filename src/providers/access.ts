import type { AccessControlProvider } from '@refinedev/core';
import { getAccessToken } from '../api/tokenStore';

// Refine access control driven by the access token's permission claims (WS3 §3b;
// the codes are the cross-repo contract, docs/contracts.md → Auth → RBAC). This
// hides/guards UI only — the backend independently enforces every permission, so
// a tampered token gains nothing.

interface TokenClaims {
  role: string | null;
  perms: string[];
}

/** Decode the (unverified) access-token payload for its role + perms. UI-only. */
export function currentClaims(): TokenClaims {
  const token = getAccessToken();
  if (!token) return { role: null, perms: [] };
  try {
    const part = token.split('.')[1];
    const json = atob(part.replace(/-/g, '+').replace(/_/g, '/'));
    const payload = JSON.parse(json) as { role?: string | null; perms?: unknown };
    return {
      role: payload.role ?? null,
      perms: Array.isArray(payload.perms) ? (payload.perms as string[]) : [],
    };
  } catch {
    return { role: null, perms: [] };
  }
}

export function hasPermission(code: string): boolean {
  return currentClaims().perms.includes(code);
}

// Refine resource + action → required permission code. Unmapped pairs are allowed
// (so generic actions never lock the UI); the backend remains the source of truth.
const PERMISSION_MAP: Record<string, Partial<Record<string, string>>> = {
  orders: { list: 'orders.read', show: 'orders.read' },
  'daily-prices': { list: 'prices.read' },
  route: { list: 'route.view' },
  'shopping-list': { list: 'shopping_list.view' },
  products: {
    list: 'products.read',
    show: 'products.read',
    create: 'products.create',
    edit: 'products.update',
    delete: 'products.delete',
  },
  categories: {
    list: 'categories.read',
    create: 'categories.create',
    edit: 'categories.update',
    delete: 'categories.delete',
  },
  slots: { list: 'slots.read', create: 'slots.manage', edit: 'slots.manage', delete: 'slots.manage' },
  customers: { list: 'customers.read', show: 'customers.read' },
  wishes: { list: 'wishes.read' },
  admins: {
    list: 'admins.read',
    show: 'admins.read',
    create: 'admins.manage',
    edit: 'admins.manage',
    delete: 'admins.manage',
  },
  roles: {
    list: 'roles.read',
    show: 'roles.read',
    create: 'roles.manage',
    edit: 'roles.manage',
    delete: 'roles.manage',
  },
};

export const accessControlProvider: AccessControlProvider = {
  can: async ({ resource, action }) => {
    const required = resource ? PERMISSION_MAP[resource]?.[action] : undefined;
    if (!required) return { can: true };
    return { can: hasPermission(required) };
  },
  options: {
    buttons: { enableAccessControl: true, hideIfUnauthorized: true },
  },
};
