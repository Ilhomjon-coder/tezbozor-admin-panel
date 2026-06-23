import { Link } from 'react-router-dom';
import { ShopOutlined } from '@ant-design/icons';
import { brand } from '../theme';
import { text } from '../i18n/uz';

// Brand title for the ThemedLayoutV2 sider — a green mark tile + the Tezbozor
// wordmark (hidden when the sider is collapsed). ThemedLayoutV2 passes `collapsed`.
export function Title({ collapsed }: { collapsed: boolean }) {
  return (
    <Link
      to="/"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        textDecoration: 'none',
        height: 40,
      }}
    >
      <span
        style={{
          display: 'inline-flex',
          width: 32,
          height: 32,
          borderRadius: 8,
          background: brand.green,
          color: '#fff',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 18,
          flexShrink: 0,
        }}
      >
        <ShopOutlined />
      </span>
      {!collapsed ? (
        <span
          style={{
            fontFamily: brand.fontHeading,
            fontWeight: 800,
            fontSize: 18,
            color: brand.green,
            whiteSpace: 'nowrap',
          }}
        >
          {text.app.title}
        </span>
      ) : null}
    </Link>
  );
}
