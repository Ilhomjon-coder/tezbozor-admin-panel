import { useEffect, useState } from 'react';
import { CreateButton, DeleteButton, EditButton, List, useSelect, useTable } from '@refinedev/antd';
import { Input, Select, Space, Table, Tag } from 'antd';
import type { AdminCategory, AdminProduct, ProductBadge, Unit } from '../../api/types';
import { assetUrl } from '../../lib/assets';
import { text, unitLabel } from '../../i18n/uz';

export const ProductsListPage = () => {
  const { tableProps, setFilters } = useTable<AdminProduct>({
    syncWithLocation: false,
    pagination: { pageSize: 20 },
    sorters: { initial: [{ field: 'sortOrder', order: 'asc' }] },
  });

  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState<number | undefined>();

  const { selectProps: categorySelect } = useSelect<AdminCategory>({
    resource: 'categories',
    optionLabel: 'nameUz',
    optionValue: 'id',
    pagination: { mode: 'off' },
  });

  // Re-filter server-side whenever search/category change.
  useEffect(() => {
    const filters = [];
    if (search) filters.push({ field: 'search', operator: 'contains' as const, value: search });
    if (categoryId) filters.push({ field: 'categoryId', operator: 'eq' as const, value: categoryId });
    setFilters(filters, 'replace');
  }, [search, categoryId, setFilters]);

  return (
    <List title={text.products.title} headerButtons={<CreateButton>{text.common.create}</CreateButton>}>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Space wrap>
          <Input.Search
            placeholder={text.products.name}
            allowClear
            style={{ width: 240 }}
            onSearch={setSearch}
          />
          <Select
            allowClear
            showSearch
            optionFilterProp="label"
            options={categorySelect.options}
            placeholder={text.products.category}
            style={{ width: 220 }}
            value={categoryId}
            onChange={(v) => setCategoryId(v as number | undefined)}
          />
        </Space>

        <Table {...tableProps} rowKey="id" size="middle" locale={{ emptyText: text.common.empty }}>
          <Table.Column
            title={text.products.image}
            dataIndex="imageUrl"
            width={64}
            render={(v: string | null) =>
              v ? (
                <img src={assetUrl(v)} alt="" style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 6 }} />
              ) : (
                text.common.none
              )
            }
          />
          <Table.Column title={text.products.name} dataIndex="nameUz" sorter />
          <Table.Column title={text.products.category} dataIndex="categoryNameUz" />
          <Table.Column title={text.products.unit} dataIndex="unit" render={(u: Unit) => unitLabel[u]} />
          <Table.Column
            title={text.products.active}
            dataIndex="isActive"
            sorter
            render={(a: boolean) => <Tag color={a ? 'green' : 'default'}>{a ? text.common.yes : text.common.no}</Tag>}
          />
          <Table.Column title={text.products.badge} dataIndex="badge" render={(b: ProductBadge) => b ?? text.common.none} />
          <Table.Column
            title={text.products.productOfDay}
            dataIndex="isProductOfDay"
            render={(a: boolean) => (a ? '⭐' : text.common.none)}
          />
          <Table.Column title={text.products.sortOrder} dataIndex="sortOrder" width={80} sorter />
          <Table.Column
            title={text.common.actions}
            width={110}
            render={(_, r: AdminProduct) => (
              <Space>
                <EditButton hideText size="small" recordItemId={r.id} />
                <DeleteButton hideText size="small" recordItemId={r.id} confirmTitle={text.common.deleteConfirm} />
              </Space>
            )}
          />
        </Table>
      </Space>
    </List>
  );
};
