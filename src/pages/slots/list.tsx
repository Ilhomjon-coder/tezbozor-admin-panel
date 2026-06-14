import { CreateButton, DeleteButton, EditButton, List, useTable } from '@refinedev/antd';
import { Space, Table, Tag } from 'antd';
import type { AdminSlot } from '../../api/types';
import { text } from '../../i18n/uz';

export const SlotsListPage = () => {
  const { tableProps } = useTable<AdminSlot>({ pagination: { mode: 'off' }, syncWithLocation: false });

  return (
    <List title={text.slots.title} headerButtons={<CreateButton>{text.common.create}</CreateButton>}>
      <Table {...tableProps} rowKey="id" size="middle" locale={{ emptyText: text.common.empty }}>
        <Table.Column title={text.slots.date} dataIndex="date" />
        <Table.Column title={text.slots.label} dataIndex="label" />
        <Table.Column title={text.slots.capacity} dataIndex="capacity" width={100} />
        <Table.Column
          title={text.slots.taken}
          width={120}
          render={(_, r: AdminSlot) => `${r.takenCount} / ${r.capacity}`}
        />
        <Table.Column
          title={text.slots.isOpen}
          dataIndex="isOpen"
          render={(v: boolean) => <Tag color={v ? 'green' : 'default'}>{v ? text.common.yes : text.common.no}</Tag>}
        />
        <Table.Column
          title={text.common.actions}
          width={110}
          render={(_, r: AdminSlot) => (
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
