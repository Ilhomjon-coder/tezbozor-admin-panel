import type {
  BaseRecord,
  CreateParams,
  CreateResponse,
  CustomParams,
  CustomResponse,
  DataProvider,
  DeleteOneParams,
  DeleteOneResponse,
  GetListParams,
  GetListResponse,
  GetManyParams,
  GetManyResponse,
  GetOneParams,
  GetOneResponse,
  UpdateParams,
  UpdateResponse,
} from '@refinedev/core';
import { API_URL, apiFetch, apiList } from './http';

// A small custom data provider over our auth-aware apiFetch. We own both ends of
// the contract, so there is no pagination protocol to satisfy: admin lists are
// tiny (≤100 orders/day, ~40 products) and the backend returns plain arrays —
// `total` is just the array length. Every call carries the Bearer token and the
// 401→refresh retry for free (see http.ts).

// Refine resource name → admin endpoint path.
const RESOURCE_PATHS: Record<string, string> = {
  orders: '/admin/orders',
  products: '/admin/products',
  categories: '/admin/categories',
  slots: '/admin/slots',
  admins: '/admin/admins',
  roles: '/admin/roles',
  permissions: '/admin/permissions',
  customers: '/admin/customers',
  wishes: '/admin/wishes',
};

function pathFor(resource: string): string {
  const path = RESOURCE_PATHS[resource];
  if (!path) throw new Error(`Unknown admin resource: ${resource}`);
  return path;
}

// Map Refine's list request → our backend query convention (WS2 §2c):
//   filters → ?field=value   (the field name IS the backend param: date/status/
//             slotId/search/categoryId/isActive — any operator is flattened)
//   sorters → ?sort=field:order   (single sort)
//   pagination → ?page&pageSize   (omitted when mode 'off' ⇒ full list)
function buildListQuery({ filters, sorters, pagination }: GetListParams): string {
  const q = new URLSearchParams();
  for (const f of filters ?? []) {
    if ('field' in f && f.value !== undefined && f.value !== null && f.value !== '') {
      q.set(f.field, String(f.value));
    }
  }
  const sorter = sorters?.[0];
  if (sorter) q.set('sort', `${sorter.field}:${sorter.order}`);
  if (pagination && pagination.mode !== 'off' && pagination.current && pagination.pageSize) {
    q.set('page', String(pagination.current));
    q.set('pageSize', String(pagination.pageSize));
  }
  const s = q.toString();
  return s ? `?${s}` : '';
}

export const dataProvider: DataProvider = {
  getApiUrl: () => API_URL,

  getList: async <TData extends BaseRecord = BaseRecord>(
    params: GetListParams,
  ): Promise<GetListResponse<TData>> => {
    const { data, total } = await apiList<TData>(`${pathFor(params.resource)}${buildListQuery(params)}`);
    return { data, total };
  },

  getOne: async <TData extends BaseRecord = BaseRecord>({
    resource,
    id,
  }: GetOneParams): Promise<GetOneResponse<TData>> => {
    const data = await apiFetch<TData>(`${pathFor(resource)}/${id}`);
    return { data };
  },

  getMany: async <TData extends BaseRecord = BaseRecord>({
    resource,
    ids,
  }: GetManyParams): Promise<GetManyResponse<TData>> => {
    const data = await Promise.all(ids.map((id) => apiFetch<TData>(`${pathFor(resource)}/${id}`)));
    return { data };
  },

  create: async <TData extends BaseRecord = BaseRecord, TVariables = object>({
    resource,
    variables,
  }: CreateParams<TVariables>): Promise<CreateResponse<TData>> => {
    const data = await apiFetch<TData>(pathFor(resource), {
      method: 'POST',
      body: JSON.stringify(variables),
    });
    return { data };
  },

  update: async <TData extends BaseRecord = BaseRecord, TVariables = object>({
    resource,
    id,
    variables,
  }: UpdateParams<TVariables>): Promise<UpdateResponse<TData>> => {
    const data = await apiFetch<TData>(`${pathFor(resource)}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(variables),
    });
    return { data };
  },

  deleteOne: async <TData extends BaseRecord = BaseRecord, TVariables = object>({
    resource,
    id,
  }: DeleteOneParams<TVariables>): Promise<DeleteOneResponse<TData>> => {
    await apiFetch<void>(`${pathFor(resource)}/${id}`, { method: 'DELETE' });
    return { data: { id } as unknown as TData };
  },

  custom: async <TData extends BaseRecord = BaseRecord>({
    url,
    method,
    payload,
    headers,
  }: CustomParams): Promise<CustomResponse<TData>> => {
    const data = await apiFetch<TData>(url, {
      method: (method ?? 'get').toUpperCase(),
      ...(payload !== undefined ? { body: JSON.stringify(payload) } : {}),
      ...(headers ? { headers: headers as HeadersInit } : {}),
    });
    return { data };
  },
};
