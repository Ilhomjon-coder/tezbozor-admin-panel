import { brand } from '../theme';

// A native date input adapted to AntD Form (Form.Item injects value/onChange).
// Yields a plain "YYYY-MM-DD" string — the shape the backend date columns expect —
// avoiding a dayjs dependency.
export const DateInput = ({
  value,
  onChange,
}: {
  value?: string;
  onChange?: (value: string) => void;
}) => (
  <input
    type="date"
    value={value ?? ''}
    onChange={(e) => onChange?.(e.target.value)}
    style={{
      height: 36,
      padding: '0 10px',
      border: `1px solid ${brand.ink200}`,
      borderRadius: 8,
      fontSize: 15,
    }}
  />
);
