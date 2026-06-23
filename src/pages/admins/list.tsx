import { CreateButton, EditButton, List, useTable } from '@refinedev/antd';
import { Table, Tag } from 'antd';
import type { AdminUser } from '../../api/types';
import { text } from '../../i18n/uz';

export const AdminsListPage = () => {
  const { tableProps } = useTable<AdminUser>({ pagination: { mode: 'off' }, syncWithLocation: false });

  return (
    <List title={text.admins.title} headerButtons={<CreateButton>{text.admins.add}</CreateButton>}>
      <Table {...tableProps} rowKey="id" size="middle" locale={{ emptyText: text.common.empty }}>
        <Table.Column title={text.admins.username} dataIndex="username" />
        <Table.Column
          title={text.admins.role}
          dataIndex="roleName"
          render={(v: string | null) => v ?? text.common.none}
        />
        <Table.Column
          title={text.admins.status}
          dataIndex="isActive"
          width={130}
          render={(v: boolean) => <Tag color={v ? 'green' : 'red'}>{v ? text.admins.active : text.admins.inactive}</Tag>}
        />
        <Table.Column
          title={text.common.actions}
          width={90}
          render={(_, r: AdminUser) => <EditButton hideText size="small" recordItemId={r.id} />}
        />
      </Table>
    </List>
  );
};
