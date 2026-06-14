import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigation } from '@refinedev/core';
import {
  Alert,
  App,
  Button,
  Card,
  ConfigProvider,
  Descriptions,
  Popconfirm,
  Space,
  Spin,
  Statistic,
  Steps,
  Tag,
  Typography,
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { ApiError, apiFetch } from '../../api/http';
import type { AdminOrderDetail, ItemStatus, OrderStatus } from '../../api/types';
import { formatDateTime, formatSignedSom, formatSom } from '../../lib/format';
import { brand, ctaTheme } from '../../theme';
import {
  orderStatusColor,
  orderStatusLabel,
  orderTransitionLabel,
  paymentMethodLabel,
  paymentStatusLabel,
  text,
} from '../../i18n/uz';
import { OrderItemRow } from './OrderItemRow';

const { Title, Text } = Typography;

// The 4 happy-path steps shown as a progress bar (the customer-facing timeline).
const HAPPY_PATH: OrderStatus[] = ['accepted', 'shopping', 'on_the_way', 'delivered'];

export const OrderShowPage = () => {
  const { message } = App.useApp();
  const { list } = useNavigation();
  const params = useParams();
  const id = Number(params.id);

  const [order, setOrder] = useState<AdminOrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setOrder(await apiFetch<AdminOrderDetail>(`/admin/orders/${id}`));
    } catch {
      message.error(text.common.error);
    } finally {
      setLoading(false);
    }
  }, [id, message]);

  useEffect(() => {
    void load();
  }, [load]);

  const transition = async (to: OrderStatus) => {
    setBusy(true);
    try {
      const updated = await apiFetch<AdminOrderDetail>(`/admin/orders/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: to }),
      });
      setOrder(updated);
      message.success(text.orders.statusUpdated);
    } catch (e) {
      message.error(e instanceof ApiError ? e.message : text.common.error);
    } finally {
      setBusy(false);
    }
  };

  const patchItem = async (
    itemId: number,
    patch: { itemStatus?: ItemStatus; adjustedPriceUzs?: number | null },
  ) => {
    try {
      const updated = await apiFetch<AdminOrderDetail>(`/admin/orders/${id}/items/${itemId}`, {
        method: 'PATCH',
        body: JSON.stringify(patch),
      });
      setOrder(updated);
      message.success(text.orders.itemUpdated);
    } catch (e) {
      message.error(e instanceof ApiError ? e.message : text.common.error);
    }
  };

  if (loading || !order) {
    return (
      <div style={{ textAlign: 'center', padding: 64 }}>
        <Spin />
      </div>
    );
  }

  const terminal = order.allowedTransitions.length === 0;
  const stepIndex = HAPPY_PATH.indexOf(order.status);
  const r = order.recalc;

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <Space align="center">
        <Button icon={<ArrowLeftOutlined />} onClick={() => list('orders')}>
          {text.common.back}
        </Button>
        <Title level={3} style={{ margin: 0 }}>
          {text.orders.detailTitle(order.id)}
        </Title>
        <Tag color={orderStatusColor[order.status]}>{orderStatusLabel[order.status]}</Tag>
      </Space>

      {/* ── Status: progress + legal-only transition buttons ── */}
      <Card variant="borderless" title={text.orders.timeline}>
        {order.status === 'cancelled' ? (
          <Tag color="red" style={{ marginBottom: 16 }}>
            {orderStatusLabel.cancelled}
          </Tag>
        ) : (
          <Steps
            size="small"
            current={stepIndex}
            items={HAPPY_PATH.map((s) => ({ title: orderStatusLabel[s] }))}
            style={{ marginBottom: 20 }}
          />
        )}

        <Space wrap>
          {order.allowedTransitions.map((to) => {
            const isCancel = to === 'cancelled';
            const btn = (
              <ConfigProvider key={to} theme={isCancel ? undefined : ctaTheme}>
                <Button type="primary" danger={isCancel} loading={busy}>
                  {orderTransitionLabel[to]}
                </Button>
              </ConfigProvider>
            );
            return isCancel ? (
              <Popconfirm
                key={to}
                title={text.common.deleteConfirm}
                okText={text.common.yes}
                cancelText={text.common.no}
                onConfirm={() => void transition(to)}
              >
                {btn}
              </Popconfirm>
            ) : (
              <span key={to} onClick={() => void transition(to)}>
                {btn}
              </span>
            );
          })}
          {terminal && <Text type="secondary">{orderStatusLabel[order.status]}</Text>}
        </Space>

        {order.statusEvents.length > 0 && (
          <div style={{ marginTop: 16 }}>
            {order.statusEvents.map((e, i) => (
              <Text key={i} type="secondary" style={{ display: 'block', fontSize: 12 }}>
                {formatDateTime(e.createdAt)} — {orderStatusLabel[e.fromStatus]} →{' '}
                {orderStatusLabel[e.toStatus]}
                {e.adminUsername ? ` (${e.adminUsername})` : ''}
              </Text>
            ))}
          </div>
        )}
      </Card>

      {/* ── Customer / delivery ── */}
      <Card variant="borderless">
        <Descriptions column={{ xs: 1, sm: 2 }} size="small">
          <Descriptions.Item label={text.orders.customer}>
            {order.customer?.name ?? text.common.none}
          </Descriptions.Item>
          <Descriptions.Item label={text.orders.phone}>
            {order.customer?.phone ? <a href={`tel:${order.customer.phone}`}>{order.customer.phone}</a> : text.common.none}
          </Descriptions.Item>
          <Descriptions.Item label={text.orders.address}>
            {order.address
              ? `${order.address.mahalla}, ${order.address.house}${
                  order.address.landmark ? ` (${order.address.landmark})` : ''
                }`
              : text.common.none}
          </Descriptions.Item>
          <Descriptions.Item label={text.orders.slot}>
            {order.slot ? `${order.slot.date} · ${order.slot.label}` : text.common.none}
          </Descriptions.Item>
          <Descriptions.Item label={text.orders.placedAt}>{formatDateTime(order.createdAt)}</Descriptions.Item>
          <Descriptions.Item label="To‘lov">
            {paymentMethodLabel[order.paymentMethod]} · {paymentStatusLabel[order.paymentStatus]}
          </Descriptions.Item>
          {order.customerNote && (
            <Descriptions.Item label={text.orders.note} span={2}>
              {order.customerNote}
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>

      {/* ── Items: per-item shopping adjustments ── */}
      <Card variant="borderless" title={text.orders.items}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1.2fr 1.4fr 1.3fr 1.2fr',
            gap: 10,
            fontSize: 12,
            color: brand.ink600,
            paddingBottom: 6,
            borderBottom: `2px solid ${brand.greenLight}`,
          }}
        >
          <div>{text.orders.itemName}</div>
          <div>{text.orders.qty}</div>
          <div>{text.orders.snapshotPrice}</div>
          <div>{text.orders.itemStatus}</div>
          <div>{text.orders.adjustedPrice}</div>
          <div style={{ textAlign: 'right' }}>{text.orders.effectiveTotal}</div>
        </div>

        {order.items.map((item) => (
          <OrderItemRow key={item.id} item={item} disabled={terminal} onPatch={patchItem} />
        ))}
      </Card>

      {/* ── Server-recomputed totals (admin never computes money) ── */}
      <Card variant="borderless">
        {r.overageUzs > 0 && (
          <Alert type="warning" showIcon style={{ marginBottom: 16 }} message={text.orders.overageWarning} />
        )}
        <Space size="large" wrap>
          <Statistic title={text.orders.asPlacedTotal} value={formatSom(order.grandTotalUzs)} />
          <Statistic title={text.orders.adjustedTotal} value={formatSom(r.adjustedGrandTotalUzs)} />
          <Statistic
            title={text.orders.cashToCollect}
            value={formatSom(r.cashToCollectUzs)}
            valueStyle={{ color: brand.green, fontWeight: 700 }}
          />
          <Statistic
            title={text.orders.refundDelta}
            value={formatSignedSom(r.refundDeltaUzs)}
            valueStyle={{ color: r.refundDeltaUzs > 0 ? brand.green : r.refundDeltaUzs < 0 ? brand.danger : brand.ink600 }}
          />
        </Space>
      </Card>
    </Space>
  );
};
