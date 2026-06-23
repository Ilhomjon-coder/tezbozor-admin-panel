import { Avatar, Button, Grid, Layout, Space, Switch, Tooltip, Typography, theme as antdThemeApi } from 'antd';
import { MenuOutlined, UserOutlined } from '@ant-design/icons';
import { useGetIdentity } from '@refinedev/core';
import { useThemedLayoutContext } from '@refinedev/antd';
import { useColorMode } from '../providers/color-mode';
import { brand } from '../theme';
import { text } from '../i18n/uz';

const { useToken } = antdThemeApi;
const { useBreakpoint } = Grid;

// Sticky top bar for the ThemedLayoutV2 shell: mobile sider trigger (left),
// theme toggle + signed-in operator identity (right). The role tag falls back to
// a generic label until RBAC (WS2/3b) puts a real role on the identity.
interface AdminIdentity {
  id: number;
  name?: string;
  role?: string;
}

export function Header() {
  const { token } = useToken();
  const screens = useBreakpoint();
  const { mode, toggle } = useColorMode();
  const { setMobileSiderOpen } = useThemedLayoutContext();
  const { data: identity } = useGetIdentity<AdminIdentity>();

  const isMobile = !screens.lg;

  return (
    <Layout.Header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        height: 64,
        padding: '0 16px',
        background: token.colorBgElevated,
        borderBottom: `1px solid ${token.colorBorderSecondary}`,
      }}
    >
      {isMobile ? (
        <Button
          type="text"
          aria-label={text.app.menu}
          icon={<MenuOutlined />}
          onClick={() => setMobileSiderOpen(true)}
        />
      ) : null}

      <div style={{ flex: 1 }} />

      <Tooltip title={text.app.themeTooltip}>
        <Switch
          checkedChildren="🌙"
          unCheckedChildren="☀️"
          checked={mode === 'dark'}
          onChange={toggle}
          aria-label={text.app.themeTooltip}
        />
      </Tooltip>

      <Space size={10}>
        <Avatar size="small" style={{ backgroundColor: brand.green, flexShrink: 0 }} icon={<UserOutlined />}>
          {identity?.name ? identity.name.charAt(0).toUpperCase() : null}
        </Avatar>
        {screens.sm ? (
          <Space direction="vertical" size={0} style={{ lineHeight: 1.15 }}>
            <Typography.Text strong style={{ fontSize: 13 }}>
              {identity?.name ?? text.common.none}
            </Typography.Text>
            <Typography.Text type="secondary" style={{ fontSize: 11 }}>
              {identity?.role ?? text.app.role}
            </Typography.Text>
          </Space>
        ) : null}
      </Space>
    </Layout.Header>
  );
}
