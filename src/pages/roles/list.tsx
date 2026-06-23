import { CreateButton, DeleteButton, EditButton, List, useTable } from '@refinedev/antd';
import { Space, Table, Tag } from 'antd';
import type { Role } from '../../api/types';
import { text } from '../../i18n/uz';

export const RolesListPage = () => {
  const { tableProps } = useTable<Role>({ pagination: { mode: 'off' }, syncWithLocation: false });

  return (
    <List title={text.roles.title} headerButtons={<CreateButton>{text.roles.add}</CreateButton>}>
      <Table {...tableProps} rowKey="id" size="middle" locale={{ emptyText: text.common.empty }}>
        <Table.Column
          title={text.roles.name}
          dataIndex="name"
          render={(v: string, r: Role) => (
            <Space>
              {v}
              {r.isSystem ? <Tag color="blue">{text.roles.system}</Tag> : null}
            </Space>
          )}
        />
        <Table.Column
          title={text.roles.description}
          dataIndex="description"
          render={(v: string | null) => v ?? text.common.none}
        />
        <Table.Column
          title={text.roles.permissions}
          dataIndex="permissions"
          width={140}
          render={(p: string[]) => text.roles.permissionCount(p.length)}
        />
        <Table.Column
          title={text.common.actions}
          width={110}
          render={(_, r: Role) => (
            <Space>
              <EditButton hideText size="small" recordItemId={r.id} />
              {/* Default roles can't be deleted (backend enforces; hide the button). */}
              {!r.isSystem ? (
                <DeleteButton hideText size="small" recordItemId={r.id} confirmTitle={text.common.deleteConfirm} />
              ) : null}
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
