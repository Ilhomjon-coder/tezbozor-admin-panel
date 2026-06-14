import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { App, Button, Card, Space, Spin, Tag, Typography } from 'antd';
import { ReloadOutlined, SaveOutlined } from '@ant-design/icons';
import { ConfigProvider } from 'antd';
import { apiFetch } from '../../api/http';
import type { DailyPriceBoard, DailyPriceRow } from '../../api/types';
import { todayTashkent } from '../../lib/format';
import { ctaTheme, brand } from '../../theme';
import { text, unitLabel } from '../../i18n/uz';

const { Title, Text } = Typography;

// The make-or-break daily ritual (PRD §8): one fast table of every active
// product for a date, optimised for keyboard speed. Enter/↓ move down a cell,
// ↑ moves up; "Hammasini saqlash" bulk-upserts. Prices are integer so'm; the
// server is the only money authority — we just transport the numbers.
export const DailyPricesPage = () => {
  const { message } = App.useApp();
  const [date, setDate] = useState<string>(todayTashkent());
  const [board, setBoard] = useState<DailyPriceBoard | null>(null);
  const [prices, setPrices] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  const load = useCallback(
    async (forDate: string) => {
      setLoading(true);
      try {
        const data = await apiFetch<DailyPriceBoard>(`/admin/daily-prices?date=${forDate}`);
        setBoard(data);
        setPrices(
          Object.fromEntries(
            data.rows.map((r) => [r.productId, r.priceUzs === null ? '' : String(r.priceUzs)]),
          ),
        );
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

  const rows = board?.rows ?? [];

  // Category section breaks, computed from the server's category-ordered rows.
  const grouped = useMemo(() => {
    const out: { categoryNameUz: string; items: { row: DailyPriceRow; index: number }[] }[] = [];
    rows.forEach((row, index) => {
      const last = out[out.length - 1];
      if (last && last.categoryNameUz === row.categoryNameUz) last.items.push({ row, index });
      else out.push({ categoryNameUz: row.categoryNameUz, items: [{ row, index }] });
    });
    return out;
  }, [rows]);

  const filledCount = rows.filter((r) => (prices[r.productId] ?? '') !== '').length;

  const onCellKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Enter' || e.key === 'ArrowDown') {
      e.preventDefault();
      inputs.current[index + 1]?.focus();
      inputs.current[index + 1]?.select();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      inputs.current[index - 1]?.focus();
      inputs.current[index - 1]?.select();
    }
  };

  const save = async () => {
    const payload = rows
      .map((r) => ({ productId: r.productId, raw: (prices[r.productId] ?? '').trim() }))
      .filter((p) => p.raw !== '')
      .map((p) => ({ productId: p.productId, priceUzs: Number(p.raw) }));

    const invalid = payload.find((p) => !Number.isInteger(p.priceUzs) || p.priceUzs < 0);
    if (invalid) {
      message.error(text.common.error);
      return;
    }
    if (payload.length === 0) return;

    setSaving(true);
    try {
      const updated = await apiFetch<DailyPriceBoard>('/admin/daily-prices', {
        method: 'POST',
        body: JSON.stringify({ date, prices: payload }),
      });
      setBoard(updated);
      setPrices(
        Object.fromEntries(
          updated.rows.map((r) => [r.productId, r.priceUzs === null ? '' : String(r.priceUzs)]),
        ),
      );
      message.success(text.prices.savedToast);
    } catch {
      message.error(text.common.error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card variant="borderless">
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <Title level={3} style={{ margin: 0 }}>
              {text.prices.title}
            </Title>
            <Text type="secondary">{text.prices.hint}</Text>
          </div>
          <Space wrap>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{
                height: 40,
                padding: '0 12px',
                border: `1px solid ${brand.ink200}`,
                borderRadius: 8,
                fontSize: 15,
              }}
              aria-label={text.common.date}
            />
            <Button icon={<ReloadOutlined />} onClick={() => void load(date)}>
              {text.common.refresh}
            </Button>
          </Space>
        </div>

        <Tag color={filledCount === rows.length && rows.length > 0 ? 'green' : 'gold'}>
          {text.prices.filledCount(filledCount, rows.length)}
        </Tag>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 48 }}>
            <Spin />
          </div>
        ) : (
          <div>
            {grouped.map((group) => (
              <div key={group.categoryNameUz} style={{ marginBottom: 20 }}>
                <div
                  style={{
                    fontFamily: brand.fontHeading,
                    fontWeight: 600,
                    color: brand.green,
                    padding: '6px 0',
                    borderBottom: `2px solid ${brand.greenLight}`,
                    marginBottom: 4,
                  }}
                >
                  {group.categoryNameUz}
                </div>
                {group.items.map(({ row, index }) => (
                  <div
                    key={row.productId}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 12,
                      padding: '6px 0',
                      borderBottom: `1px solid ${brand.paper}`,
                    }}
                  >
                    <span style={{ flex: 1 }}>
                      {row.nameUz}{' '}
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        ({unitLabel[row.unit]})
                      </Text>
                    </span>
                    <Space size={6}>
                      <input
                        ref={(el) => {
                          inputs.current[index] = el;
                        }}
                        value={prices[row.productId] ?? ''}
                        onChange={(e) =>
                          setPrices((p) => ({
                            ...p,
                            [row.productId]: e.target.value.replace(/[^\d]/g, ''),
                          }))
                        }
                        onKeyDown={(e) => onCellKeyDown(e, index)}
                        onFocus={(e) => e.target.select()}
                        inputMode="numeric"
                        placeholder={text.prices.placeholder}
                        style={{
                          width: 130,
                          height: 38,
                          textAlign: 'right',
                          padding: '0 10px',
                          border: `1px solid ${
                            (prices[row.productId] ?? '') === '' ? brand.orange : brand.ink200
                          }`,
                          borderRadius: 8,
                          fontSize: 15,
                        }}
                      />
                      <Text type="secondary">so‘m</Text>
                    </Space>
                  </div>
                ))}
              </div>
            ))}

            {rows.length === 0 && <Text type="secondary">{text.common.empty}</Text>}
          </div>
        )}

        <ConfigProvider theme={ctaTheme}>
          <Button
            type="primary"
            size="large"
            icon={<SaveOutlined />}
            loading={saving}
            onClick={() => void save()}
            disabled={rows.length === 0}
          >
            {text.prices.saveAll}
          </Button>
        </ConfigProvider>
      </Space>
    </Card>
  );
};
