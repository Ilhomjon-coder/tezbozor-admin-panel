import { List, useTable } from '@refinedev/antd';
import { Table, Typography } from 'antd';
import type { AdminWish } from '../../api/types';
import { formatDateTime } from '../../lib/format';
import { text } from '../../i18n/uz';

export const WishesListPage = () => {
  const { tableProps } = useTable<AdminWish>({
    syncWithLocation: false,
    pagination: { pageSize: 20 },
    sorters: { initial: [{ field: 'createdAt', order: 'desc' }] },
  });

  return (
    <List title={text.wishes.title}>
      <Typography.Paragraph type="secondary">{text.wishes.hint}</Typography.Paragraph>
      <Table {...tableProps} rowKey="id" size="middle" locale={{ emptyText: text.common.empty }}>
        <Table.Column title={text.wishes.text} dataIndex="text" />
        <Table.Column
          title={text.wishes.customer}
          render={(_, r: AdminWish) => r.customer.name ?? r.customer.phone ?? text.common.none}
        />
        <Table.Column
          title={text.wishes.createdAt}
          dataIndex="createdAt"
          width={180}
          sorter
          render={(v: string) => formatDateTime(v)}
        />
      </Table>
    </List>
  );
};
