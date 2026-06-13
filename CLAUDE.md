# CLAUDE.md — admin-panel

Internal dashboard for the 3 founders/operators. Read root `../CLAUDE.md`, `../docs/PRD.md` (§5 admin), `../docs/contracts.md` first.

## Stack

- **Refine** (React) + **Ant Design** + Vite + TypeScript — AntD is the path of least resistance for dense CRUD tables.
- **Leaflet + OpenStreetMap** for the hot-spot map.
- Auth: **JWT access + opaque refresh** per contracts.md (access in memory, refresh in httpOnly cookie, refresh endpoint rotates).
- API client generated from backend OpenAPI (`pnpm gen:api`) — never hand-write types.

There are **no bespoke designs** for admin (the `designs/` folder in tgbot is customer-only). Use AntD defaults + the brand **color and font tokens** (green `#1FA055`, orange `#FF7A00` for primary actions, Inter/Montserrat). Blue is fine in admin if AntD uses it internally, but prefer the brand green for primary.

## Key screens (PRD §5)

1. **Daily price bulk editor** — the make-or-break screen. A single table of all active products for a chosen date; fill prices fast with keyboard (Tab between cells, Enter to save row). This is a **daily ~10-minute ritual** for the operator — optimize for speed, not prettiness. `GET/POST /admin/daily-prices?date=`.
2. **Orders** — list (filter by date / status / slot), detail, status transitions (fire bot notifications), per-item status (`bought | substituted | skipped`) + adjusted price → total recalculated **server-side** (admin UI shows the new total + refund delta, never computes money itself).
3. **Route page (mobile-first)** — today's orders grouped by slot, manual drag to order the stops; each card: address, phone (tap-to-call `tel:`), item list, "Yetkazildi ✓". This is the only mobile-first screen — the operator uses it on a phone while delivering.
4. **Dashboards** — orders/day chart; repeat-customer % (re-order within 21 days); **hot-spot map** (one pin per delivered order, Leaflet); top products table; **wishes** list (unmatched search queries from the mini app).
5. CRUD: products (with image upload), categories, slots (capacity per date).

## Iron rules

- **Never compute money client-side.** Totals, refund deltas, recalculations come from the backend. The panel displays them.
- Money display: integer so'm, `127 000 so'm`.
- Enums exactly as contracts.md; statuses/labels in Uzbek for display, English in code.
- MVP single role `admin` (no RBAC).

## Env

`admin-panel/.env.example`: `VITE_API_BASE_URL`

## Commands

`pnpm dev` · `pnpm gen:api` · `pnpm build`.
