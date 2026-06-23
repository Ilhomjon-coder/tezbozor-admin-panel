import { useCallback, useEffect, useState } from 'react';
import { App, Button, Card, ConfigProvider, Space, Spin, Tag, Typography } from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined, PhoneOutlined, ReloadOutlined } from '@ant-design/icons';
import { ApiError, apiFetch } from '../../api/http';
import type { OrderStatus, RouteBoard, RouteOrder } from '../../api/types';
import { formatQty, formatSom, todayTashkent } from '../../lib/format';
import { brand, ctaTheme } from '../../theme';
import {
  itemFallbackLabel,
  itemStatusLabel,
  orderStatusColor,
  orderStatusLabel,
  text,
  unitLabel,
} from '../../i18n/uz';

const { Title, Text } = Typography;

const seqKey = (date: string, slotId: number) => `tz-route-${date}-${slotId}`;

// Operator delivery order persists locally (one operator, one phone, per day).
function loadSeq(date: string, slotId: number, ids: number[]): number[] {
  try {
    const saved = JSON.parse(localStorage.getItem(seqKey(date, slotId)) ?? 'null') as number[] | null;
    if (!saved) return ids;
    return saved.filter((id) => ids.includes(id)).concat(ids.filter((id) => !saved.includes(id)));
  } catch {
    return ids;
  }
}

export const RoutePage = () => {
  const { message } = App.useApp();
  const [date, setDate] = useState<string>(todayTashkent());
  const [board, setBoard] = useState<RouteBoard | null>(null);
  const [loading, setLoading] = useState(true);
  const [seq, setSeq] = useState<Record<number, number[]>>({});

  const load = useCallback(
    async (forDate: string) => {
      setLoading(true);
      try {
        const data = await apiFetch<RouteBoard>(`/admin/route?date=${forDate}`);
        setBoard(data);
        const nextSeq: Record<number, number[]> = {};
        for (const slot of data.slots) {
          nextSeq[slot.id] = loadSeq(forDate, slot.id, slot.orders.map((o) => o.id));
        }
        setSeq(nextSeq);
      } catch {
        message.error(text.common.error);
      } finally {
        setLoading(false);
      }
    },
    [message],
  );

  useEffect(() => {
    void load(date);
  }, [date, load]);

  const move = (slotId: number, orderId: number, dir: -1 | 1) => {
    setSeq((prev) => {
      const cur = [...(prev[slotId] ?? [])];
      const i = cur.indexOf(orderId);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= cur.length) return prev;
      [cur[i], cur[j]] = [cur[j], cur[i]];
      localStorage.setItem(seqKey(date, slotId), JSON.stringify(cur));
      return { ...prev, [slotId]: cur };
    });
  };

  const transition = async (orderId: number, to: OrderStatus) => {
    try {
      await apiFetch(`/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: to }),
      });
      message.success(text.orders.statusUpdated);
      await load(date);
    } catch (e) {
      message.error(e instanceof ApiError ? e.message : text.common.error);
    }
  };

  // Dedicated mark-delivered (gated route.mark_delivered) so a field agent — who
  // has no orders.update_status — can close out a delivery from the route page.
  const markDelivered = async (orderId: number) => {
    try {
      await apiFetch(`/admin/route/${orderId}/delivered`, { method: 'POST' });
      message.success(text.orders.statusUpdated);
      await load(date);
    } catch (e) {
      message.error(e instanceof ApiError ? e.message : text.common.error);
    }
  };

  return (
    <div style={{ maxWidth: 560, margin: '0 auto' }}>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <div>
          <Title level={3} style={{ margin: 0 }}>
            {text.route.title}
          </Title>
          <Text type="secondary">{text.route.hint}</Text>
        </div>

        <Space wrap>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{ height: 40, padding: '0 12px', border: `1px solid ${brand.ink200}`, borderRadius: 8, fontSize: 15 }}
          />
          <Button icon={<ReloadOutlined />} onClick={() => void load(date)}>
            {text.common.refresh}
          </Button>
        </Space>

        {board && !loading ? (
          <Card size="small" styles={{ body: { padding: '10px 14px' } }}>
            <Text type="secondary">{text.route.dayCashTotal}: </Text>
            <Text strong style={{ color: brand.green, fontSize: 16 }}>
              {formatSom(board.dayCashTotalUzs)}
            </Text>
          </Card>
        ) : null}

        {loading ? (
          <div style={{ textAlign: 'center', padding: 48 }}>
            <Spin />
          </div>
        ) : (
          board?.slots.map((slot) => {
            const ordersById = new Map(slot.orders.map((o) => [o.id, o]));
            const ordered = (seq[slot.id] ?? slot.orders.map((o) => o.id))
              .map((id) => ordersById.get(id))
              .filter((o): o is RouteOrder => Boolean(o));
            return (
              <div key={slot.id}>
                <div
                  style={{
                    fontFamily: brand.fontHeading,
                    fontWeight: 600,
                    color: brand.green,
                    fontSize: 16,
                    margin: '8px 0',
                  }}
                >
                  {slot.label} · {text.route.ordersInSlot(ordered.length)}
                </div>
                {ordered.length === 0 && <Text type="secondary">{text.route.noOrders}</Text>}
                {ordered.map((o, idx) => (
                  <RouteCard
                    key={o.id}
                    order={o}
                    isFirst={idx === 0}
                    isLast={idx === ordered.length - 1}
                    onUp={() => move(slot.id, o.id, -1)}
                    onDown={() => move(slot.id, o.id, 1)}
                    onTransition={(to) => void transition(o.id, to)}
                    onDeliver={() => void markDelivered(o.id)}
                  />
                ))}
              </div>
            );
          })
        )}
      </Space>
    </div>
  );
};

const RouteCard = ({
  order,
  isFirst,
  isLast,
  onUp,
  onDown,
  onTransition,
  onDeliver,
}: {
  order: RouteOrder;
  isFirst: boolean;
  isLast: boolean;
  onUp: () => void;
  onDown: () => void;
  onTransition: (to: OrderStatus) => void;
  onDeliver: () => void;
}) => {
  const canDeliver = order.allowedTransitions.includes('delivered');
  const forward = order.allowedTransitions.find((t) => t !== 'cancelled' && t !== 'delivered');

  return (
    <Card size="small" style={{ marginBottom: 12 }} styles={{ body: { padding: 14 } }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <div style={{ flex: 1 }}>
          <Text strong>#{order.id}</Text>{' '}
          <Tag color={orderStatusColor[order.status]}>{orderStatusLabel[order.status]}</Tag>
          <div style={{ marginTop: 4 }}>
            {order.address ? (
              <span>
                {order.address.mahalla}, {order.address.house}
                {order.address.landmark ? ` (${order.address.landmark})` : ''}
              </span>
            ) : (
              text.common.none
            )}
          </div>
          <Text type="secondary">{order.customer?.name ?? ''}</Text>
          {order.customerNote ? (
            <div>
              <Text type="secondary" style={{ fontSize: 12 }}>
                📝 {order.customerNote}
              </Text>
            </div>
          ) : null}
        </div>
        <Space direction="vertical" size={2}>
          <Button size="small" icon={<ArrowUpOutlined />} disabled={isFirst} onClick={onUp} aria-label={text.route.moveUp} />
          <Button size="small" icon={<ArrowDownOutlined />} disabled={isLast} onClick={onDown} aria-label={text.route.moveDown} />
        </Space>
      </div>

      <ul style={{ margin: '10px 0', paddingLeft: 18 }}>
        {order.items.map((it) => (
          <li key={it.id}>
            {it.nameSnapshot} — {formatQty(it.qty, unitLabel[it.unit])}{' '}
            {it.itemStatus !== 'pending' && (
              <Text type="secondary" style={{ fontSize: 12 }}>
                ({itemStatusLabel[it.itemStatus]})
              </Text>
            )}
            {/* Flag the B-variant only when it isn't the default substitute. */}
            {it.fallback !== 'substitute' && (
              <Tag color="orange" style={{ marginLeft: 6 }}>
                {itemFallbackLabel[it.fallback]}
              </Tag>
            )}
            {it.itemNote ? (
              <Text type="secondary" style={{ fontSize: 12 }}>
                {' '}
                · {it.itemNote}
              </Text>
            ) : null}
          </li>
        ))}
      </ul>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <Text strong>
          {text.route.cashLine}: {formatSom(order.cashToCollectUzs)}
        </Text>
        <Space>
          {order.customer?.phone && (
            <Button icon={<PhoneOutlined />} href={`tel:${order.customer.phone}`}>
              {text.route.call}
            </Button>
          )}
          {canDeliver ? (
            <ConfigProvider theme={ctaTheme}>
              <Button type="primary" onClick={onDeliver}>
                {text.route.deliver}
              </Button>
            </ConfigProvider>
          ) : forward ? (
            <Button onClick={() => onTransition(forward)}>{orderStatusLabel[forward]}</Button>
          ) : (
            <Tag color="green">{text.route.delivered}</Tag>
          )}
        </Space>
      </div>
    </Card>
  );
};
