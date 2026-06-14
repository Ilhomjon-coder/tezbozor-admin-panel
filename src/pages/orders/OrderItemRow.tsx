import { useEffect, useState } from 'react';
import { Input, Select, Space, Tag, Typography } from 'antd';
import type { AdminOrderItem, ItemStatus } from '../../api/types';
import { formatQty, formatSom } from '../../lib/format';
import { brand } from '../../theme';
import { itemFallbackLabel, itemStatusLabel, text, unitLabel } from '../../i18n/uz';

const { Text } = Typography;

const ITEM_STATUSES: ItemStatus[] = ['pending', 'bought', 'substituted', 'skipped'];

// One shopping line. The status select saves immediately; the adjusted price
// saves on blur. Both call back to the parent, which PATCHes and re-renders the
// whole order from the SERVER's recomputed numbers — this row never does money math.
export const OrderItemRow = ({
  item,
  disabled,
  onPatch,
}: {
  item: AdminOrderItem;
  disabled: boolean;
  onPatch: (itemId: number, patch: { itemStatus?: ItemStatus; adjustedPriceUzs?: number | null }) => void;
}) => {
  const [price, setPrice] = useState<string>(item.adjustedPriceUzs?.toString() ?? '');

  // Re-sync the local edit buffer whenever the server sends back a fresh value.
  useEffect(() => {
    setPrice(item.adjustedPriceUzs?.toString() ?? '');
  }, [item.adjustedPriceUzs]);

  const priceDisabled = disabled || item.itemStatus === 'skipped';

  const commitPrice = () => {
    const raw = price.trim();
    const next = raw === '' ? null : Number(raw);
    if (next !== null && (!Number.isInteger(next) || next < 0)) {
      setPrice(item.adjustedPriceUzs?.toString() ?? '');
      return;
    }
    if (next !== item.adjustedPriceUzs) onPatch(item.id, { adjustedPriceUzs: next });
  };

  const adjusted = item.adjustedPriceUzs !== null && item.itemStatus !== 'skipped';

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1.2fr 1.4fr 1.3fr 1.2fr',
        gap: 10,
        alignItems: 'center',
        padding: '10px 0',
        borderBottom: `1px solid ${brand.paper}`,
      }}
    >
      <div>
        <div>{item.nameSnapshot}</div>
        <Space size={4} wrap>
          <Tag color="default" style={{ fontSize: 11 }}>
            {itemFallbackLabel[item.fallback]}
          </Tag>
          {item.itemNote && (
            <Text type="secondary" style={{ fontSize: 12 }}>
              {item.itemNote}
            </Text>
          )}
        </Space>
      </div>

      <div>{formatQty(item.qty, unitLabel[item.unit])}</div>

      <div>
        <Text type="secondary">{formatSom(item.priceSnapshotUzs)}</Text>
      </div>

      <Select<ItemStatus>
        value={item.itemStatus}
        disabled={disabled}
        onChange={(v) => onPatch(item.id, { itemStatus: v })}
        options={ITEM_STATUSES.map((s) => ({ value: s, label: itemStatusLabel[s] }))}
        style={{ width: '100%' }}
        size="small"
      />

      <Input
        value={price}
        disabled={priceDisabled}
        onChange={(e) => setPrice(e.target.value.replace(/[^\d]/g, ''))}
        onBlur={commitPrice}
        onPressEnter={commitPrice}
        placeholder={text.orders.adjustedPrice}
        size="small"
        inputMode="numeric"
        suffix={<Text type="secondary" style={{ fontSize: 11 }}>so‘m</Text>}
      />

      <div style={{ textAlign: 'right', fontWeight: adjusted ? 600 : 400 }}>
        {formatSom(item.effectiveLineTotalUzs)}
      </div>
    </div>
  );
};
