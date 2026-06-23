import { Checkbox, Spin, Typography } from 'antd';
import { useList } from '@refinedev/core';
import type { Permission } from '../../api/types';
import { permissionGroupLabel } from '../../i18n/uz';

// Controlled form field (value: permission codes). Lives inside a Form.Item
// name="permissions", so AntD wires value/onChange. Groups the catalog by domain
// (the prefix before the dot) for a scannable editor.
export const PermissionPicker = ({
  value = [],
  onChange,
  disabled,
}: {
  value?: string[];
  onChange?: (codes: string[]) => void;
  disabled?: boolean;
}) => {
  const { data, isLoading } = useList<Permission>({
    resource: 'permissions',
    pagination: { mode: 'off' },
  });

  if (isLoading) return <Spin />;

  const groups = new Map<string, Permission[]>();
  for (const p of data?.data ?? []) {
    const domain = p.code.split('.')[0];
    const arr = groups.get(domain);
    if (arr) arr.push(p);
    else groups.set(domain, [p]);
  }

  return (
    <Checkbox.Group
      value={value}
      onChange={(v) => onChange?.(v as string[])}
      disabled={disabled}
      style={{ width: '100%' }}
    >
      {[...groups.entries()].map(([domain, list]) => (
        <div key={domain} style={{ marginBottom: 16 }}>
          <Typography.Text strong>{permissionGroupLabel[domain] ?? domain}</Typography.Text>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 6 }}>
            {list.map((p) => (
              <Checkbox key={p.code} value={p.code}>
                <code style={{ fontSize: 12 }}>{p.code}</code>
                {p.description ? (
                  <Typography.Text type="secondary" style={{ fontSize: 12, marginLeft: 8 }}>
                    {p.description}
                  </Typography.Text>
                ) : null}
              </Checkbox>
            ))}
          </div>
        </div>
      ))}
    </Checkbox.Group>
  );
};
