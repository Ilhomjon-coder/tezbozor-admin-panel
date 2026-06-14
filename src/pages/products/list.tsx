import { CreateButton, DeleteButton, EditButton, List, useTable } from '@refinedev/antd';
import { Space, Table, Tag } from 'antd';
import type { AdminProduct, ProductBadge, Unit } from '../../api/types';
import { assetUrl } from '../../lib/assets';
import { text, unitLabel } from '../../i18n/uz';

export const ProductsListPage = () => {
  const { tableProps } = useTable<AdminProduct>({ pagination: { mode: 'off' }, syncWithLocation: false });

  return (
    <List title={text.products.title} headerButtons={<CreateButton>{text.common.create}</CreateButton>}>
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
        <Table.Column title={text.products.name} dataIndex="nameUz" />
        <Table.Column title={text.products.category} dataIndex="categoryNameUz" />
        <Table.Column title={text.products.unit} dataIndex="unit" render={(u: Unit) => unitLabel[u]} />
        <Table.Column
          title={text.products.active}
          dataIndex="isActive"
          render={(a: boolean) => <Tag color={a ? 'green' : 'default'}>{a ? text.common.yes : text.common.no}</Tag>}
        />
        <Table.Column
          title={text.products.badge}
          dataIndex="badge"
          render={(b: ProductBadge) => (b ? b : text.common.none)}
        />
        <Table.Column
          title={text.products.productOfDay}
          dataIndex="isProductOfDay"
          render={(a: boolean) => (a ? '⭐' : text.common.none)}
        />
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
    </List>
  );
};
