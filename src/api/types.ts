// Domain types aliased straight from the generated OpenAPI contract
// (src/api/schema.d.ts — produced by `pnpm gen:api`, never hand-written). Pages
// import from here so the whole UI is typed off the backend contract; regenerate
// the schema whenever a backend DTO changes and these follow automatically.

import type { components } from './schema';

type S = components['schemas'];

export type AdminOrderSummary = S['AdminOrderSummaryDto'];
export type AdminOrderDetail = S['AdminOrderDetailDto'];
export type AdminOrderItem = AdminOrderDetail['items'][number];
export type OrderRecalc = AdminOrderDetail['recalc'];
export type OrderStatusEvent = AdminOrderDetail['statusEvents'][number];

export type DailyPriceBoard = S['DailyPriceBoardDto'];
export type DailyPriceRow = DailyPriceBoard['rows'][number];

export type RouteBoard = S['RouteBoardDto'];
export type RouteSlot = RouteBoard['slots'][number];
export type RouteOrder = RouteSlot['orders'][number];
export type RouteItem = RouteOrder['items'][number];

export type AdminProduct = S['AdminProductDto'];
export type AdminCategory = S['AdminCategoryDto'];
export type AdminSlot = S['AdminSlotDto'];

export type AdminUser = S['AdminUserDto'];
export type Role = S['RoleDto'];
export type Permission = S['PermissionDto'];
export type AdminCustomer = S['AdminCustomerDto'];
export type AdminWish = S['AdminWishDto'];
export type ShoppingList = S['ShoppingListDto'];
export type ShoppingCategory = ShoppingList['categories'][number];
export type ShoppingItem = ShoppingCategory['items'][number];

export type OrderStatus = AdminOrderDetail['status'];
export type ItemStatus = AdminOrderItem['itemStatus'];
export type ItemFallback = AdminOrderItem['fallback'];
export type Unit = AdminProduct['unit'];
export type ProductBadge = AdminProduct['badge'];
