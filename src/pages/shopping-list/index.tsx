import { useCallback, useEffect, useState } from 'react';
import { App, Button, Card, Space, Spin, Tag, Typography, theme } from 'antd';
import { CheckCircleOutlined, PrinterOutlined, ReloadOutlined } from '@ant-design/icons';
import { ApiError, apiFetch } from '../../api/http';
import type { ShoppingList } from '../../api/types';
import { formatQty, todayTashkent } from '../../lib/format';
import { text, unitLabel } from '../../i18n/uz';

const { Title, Text } = Typography;

// Per-day "bought" set persists locally so the operator can walk the bazaar and
// check items off across reloads (the aggregation endpoint is money-free and
// doesn't track per-product progress).
const boughtKey = (date: string) => `tz-bought-${date}`;
function loadBought(date: string): Set<number> {
  try {
    return new Set(JSON.parse(localStorage.getItem(boughtKey(date)) ?? '[]') as number[]);
  } catch {
    return new Set();
  }
}

export const ShoppingListPage = () => {
  const { message } = App.useApp();
  const { token } = theme.useToken();
  const [date, setDate] = useState(todayTashkent());
  const [board, setBoard] = useState<ShoppingList | null>(null);
  const [loading, setLoading] = useState(true);
  const [bought, setBought] = useState<Set<number>>(() => loadBought(todayTashkent()));

  const load = useCallback(
    async (forDate: string) => {
      setLoading(true);
      try {
        setBoard(await apiFetch<ShoppingList>(`/admin/shopping-list?date=${forDate}`));
      } catch {
        message.error(text.common.error);
      } finally {
        setLoading(false);
      }
    },
    [message],
  );

  useEffect(() => {
    setBought(loadBought(date));
    void load(date);
  }, [date, load]);

  // Refresh the buy-list when connectivity returns (WS3 §3e graceful offline).
  useEffect(() => {
    const onOnline = () => void load(date);
    window.addEventListener('online', onOnline);
    return () => window.removeEventListener('online', onOnline);
  }, [date, load]);

  const markBought = async (productId: number) => {
    try {
      await apiFetch('/admin/shopping-list/mark-bought', {
        method: 'POST',
        body: JSON.stringify({ date, productId }),
      });
      const next = new Set(bought).add(productId);
      setBought(next);
      localStorage.setItem(boughtKey(date), JSON.stringify([...next]));
      message.success(text.shoppingList.bought);
    } catch (e) {
      message.error(e instanceof ApiError ? e.message : text.common.error);
    }
  };

  const empty = !board || board.categories.length === 0;

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <div>
          <Title level={3} style={{ margin: 0 }}>
            {text.shoppingList.title}
          </Title>
          <Text type="secondary">{text.shoppingList.hint}</Text>
        </div>

        <Space wrap className="no-print">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{
              height: 40,
              padding: '0 12px',
              border: `1px solid ${token.colorBorder}`,
              borderRadius: 8,
              fontSize: 15,
              background: token.colorBgContainer,
              color: token.colorText,
            }}
          />
          <Button icon={<ReloadOutlined />} onClick={() => void load(date)}>
            {text.common.refresh}
          </Button>
          <Button icon={<PrinterOutlined />} onClick={() => window.print()}>
            {text.shoppingList.print}
          </Button>
        </Space>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 48 }}>
            <Spin />
          </div>
        ) : empty ? (
          <Text type="secondary">{text.shoppingList.empty}</Text>
        ) : (
          board!.categories.map((cat) => (
            <Card key={cat.id} size="small" title={cat.nameUz} styles={{ body: { padding: 0 } }}>
              {cat.items.map((it, i) => {
                const done = bought.has(it.productId);
                return (
                  <div
                    key={it.productId}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 12,
                      padding: '10px 14px',
                      borderTop: i === 0 ? 'none' : `1px solid ${token.colorBorderSecondary}`,
                    }}
                  >
                    <div>
                      <Text delete={done} strong={!done}>
                        {it.name}
                      </Text>{' '}
                      <Tag>{formatQty(it.totalQty, unitLabel[it.unit])}</Tag>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {text.shoppingList.orders(it.orderCount)}
                      </Text>
                    </div>
                    {done ? (
                      <Tag color="green" icon={<CheckCircleOutlined />}>
                        {text.shoppingList.bought}
                      </Tag>
                    ) : (
                      <Button
                        size="small"
                        type="primary"
                        className="no-print"
                        onClick={() => void markBought(it.productId)}
                      >
                        {text.shoppingList.markBought}
                      </Button>
                    )}
                  </div>
                );
              })}
            </Card>
          ))
        )}
      </Space>
    </div>
  );
};
