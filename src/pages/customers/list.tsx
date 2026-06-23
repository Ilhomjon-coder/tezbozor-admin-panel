import { List, useTable } from '@refinedev/antd';
import { Input, Space, Table } from 'antd';
import type { AdminCustomer } from '../../api/types';
import { formatDateTime } from '../../lib/format';
import { text } from '../../i18n/uz';

export const CustomersListPage = () => {
  const { tableProps, setFilters } = useTable<AdminCustomer>({
    syncWithLocation: false,
    pagination: { pageSize: 20 },
    sorters: { initial: [{ field: 'createdAt', order: 'desc' }] },
  });

  const onSearch = (value: string) =>
    setFilters(value ? [{ field: 'search', operator: 'contains', value }] : [], 'replace');

  return (
    <List title={text.customers.title}>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Input.Search
          placeholder={text.customers.search}
          allowClear
          style={{ maxWidth: 360 }}
          onSearch={onSearch}
        />
        <Table {...tableProps} rowKey="id" size="middle" locale={{ emptyText: text.common.empty }}>
          <Table.Column title={text.customers.name} dataIndex="name" render={(v: string | null) => v ?? text.common.none} />
          <Table.Column title={text.customers.phone} dataIndex="phone" render={(v: string | null) => v ?? text.common.none} />
          <Table.Column title={text.customers.ordersCount} dataIndex="ordersCount" width={130} sorter />
          <Table.Column
            title={text.customers.lastOrder}
            dataIndex="lastOrderAt"
            render={(v: string | null) => (v ? formatDateTime(v) : text.common.none)}
          />
          <Table.Column
            title={text.customers.joined}
            dataIndex="createdAt"
            sorter
            render={(v: string) => formatDateTime(v)}
          />
        </Table>
      </Space>
    </List>
  );
};
