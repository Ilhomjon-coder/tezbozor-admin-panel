import { useCallback, useEffect, useState } from 'react';
import { useNavigation } from '@refinedev/core';
import { App, Card, Select, Space, Table, Tag, Typography } from 'antd';
import { apiFetch } from '../../api/http';
import type { AdminOrderSummary, AdminSlot, OrderStatus } from '../../api/types';
import { formatDateTime, formatSignedSom, formatSom, todayTashkent } from '../../lib/format';
import { brand } from '../../theme';
import { orderStatusColor, orderStatusLabel, text } from '../../i18n/uz';

const { Title, Text } = Typography;

const STATUSES: OrderStatus[] = ['accepted', 'shopping', 'on_the_way', 'delivered', 'cancelled'];

export const OrdersListPage = () => {
  const { message } = App.useApp();
  const { show } = useNavigation();
  const [date, setDate] = useState<string>(todayTashkent());
  const [status, setStatus] = useState<OrderStatus | ''>('');
  const [slotId, setSlotId] = useState<number | ''>('');
  const [slots, setSlots] = useState<AdminSlot[]>([]);
  const [orders, setOrders] = useState<AdminOrderSummary[]>([]);
  const [loading, setLoading] = useState(false);

  // Slot options follow the chosen delivery date.
  useEffect(() => {
    void (async () => {
      try {
        setSlots(await apiFetch<AdminSlot[]>(`/admin/slots?date=${date}`));
      } catch {
        setSlots([]);
      }
      setSlotId('');
    })();
  }, [date]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (date) params.set('date', date);
      if (status) params.set('status', status);
      if (slotId) params.set('slotId', String(slotId));
      setOrders(await apiFetch<AdminOrderSummary[]>(`/admin/orders?${params.toString()}`));
    } catch {
      message.error(text.common.error);
    } finally {
      setLoading(false);
    }
  }, [date, status, slotId, message]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <Card variant="borderless">
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Title level={3} style={{ margin: 0 }}>
          {text.orders.title}
        </Title>

        <Space wrap size="middle">
          <label>
            <Text type="secondary" style={{ marginRight: 8 }}>
              {text.orders.filterDate}
            </Text>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{
                height: 36,
                padding: '0 10px',
                border: `1px solid ${brand.ink200}`,
                borderRadius: 8,
              }}
            />
          </label>
          <Select
            value={status}
            onChange={setStatus}
            style={{ width: 180 }}
            options={[
              { value: '', label: text.orders.allStatuses },
              ...STATUSES.map((s) => ({ value: s, label: orderStatusLabel[s] })),
            ]}
          />
          <Select
            value={slotId}
            onChange={setSlotId}
            style={{ width: 180 }}
            options={[
              { value: '', label: text.orders.allStatuses },
              ...slots.map((s) => ({ value: s.id, label: s.label })),
            ]}
          />
        </Space>

        <Table
          dataSource={orders}
          rowKey="id"
          loading={loading}
          size="middle"
          pagination={{ pageSize: 20, hideOnSinglePage: true }}
          onRow={(record) => ({
            style: { cursor: 'pointer' },
            onClick: () => show('orders', record.id),
          })}
          locale={{ emptyText: text.common.empty }}
          columns={[
            { title: '#', dataIndex: 'id', width: 64 },
            {
              title: text.orders.filterStatus,
              dataIndex: 'status',
              render: (s: OrderStatus) => <Tag color={orderStatusColor[s]}>{orderStatusLabel[s]}</Tag>,
            },
            {
              title: text.orders.customer,
              render: (_, o) => (
                <div>
                  <div>{o.customer?.name ?? text.common.none}</div>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {o.customer?.phone ?? ''}
                  </Text>
                </div>
              ),
            },
            {
              title: text.orders.address,
              render: (_, o) =>
                o.address ? `${o.address.mahalla}, ${o.address.house}` : text.common.none,
            },
            { title: text.orders.slot, render: (_, o) => o.slot?.label ?? text.common.none },
            { title: text.orders.itemsCount, dataIndex: 'itemCount', width: 90 },
            {
              title: text.orders.asPlacedTotal,
              render: (_, o) => formatSom(o.grandTotalUzs),
            },
            {
              title: text.orders.refundDelta,
              render: (_, o) =>
                o.recalc.refundDeltaUzs !== 0 ? (
                  <Tag color={o.recalc.refundDeltaUzs > 0 ? 'green' : 'red'}>
                    {formatSignedSom(o.recalc.refundDeltaUzs)}
                  </Tag>
                ) : (
                  text.common.none
                ),
            },
            {
              title: text.orders.placedAt,
              render: (_, o) => (
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {formatDateTime(o.createdAt)}
                </Text>
              ),
            },
          ]}
        />
      </Space>
    </Card>
  );
};
