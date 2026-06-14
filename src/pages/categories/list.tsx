import { CreateButton, DeleteButton, EditButton, List, useTable } from '@refinedev/antd';
import { Space, Table } from 'antd';
import type { AdminCategory } from '../../api/types';
import { text } from '../../i18n/uz';

export const CategoriesListPage = () => {
  const { tableProps } = useTable<AdminCategory>({ pagination: { mode: 'off' }, syncWithLocation: false });

  return (
    <List title={text.categories.title} headerButtons={<CreateButton>{text.common.create}</CreateButton>}>
      <Table {...tableProps} rowKey="id" size="middle" locale={{ emptyText: text.common.empty }}>
        <Table.Column title={text.categories.sortOrder} dataIndex="sortOrder" width={90} />
        <Table.Column title={text.categories.name} dataIndex="nameUz" />
        <Table.Column title={text.categories.slug} dataIndex="slug" />
        <Table.Column
          title={text.common.actions}
          width={110}
          render={(_, r: AdminCategory) => (
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
