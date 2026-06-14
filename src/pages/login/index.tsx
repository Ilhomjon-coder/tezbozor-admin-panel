import { useLogin } from '@refinedev/core';
import { Button, Card, ConfigProvider, Form, Input, Typography } from 'antd';
import { brand, ctaTheme } from '../../theme';
import { text } from '../../i18n/uz';

const { Title, Text } = Typography;

// Real admin login — submits to the authProvider (POST /admin/auth/login). The
// submit button uses the orange CTA theme; everything else is brand green.
export const LoginPage = () => {
  const { mutate: login, isLoading } = useLogin();

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: brand.paper,
        padding: 24,
      }}
    >
      <Card style={{ width: 380, maxWidth: '100%' }} variant="borderless">
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2} style={{ color: brand.green, marginBottom: 4 }}>
            {text.app.title}
          </Title>
          <Text type="secondary">{text.app.subtitle}</Text>
        </div>

        <Form layout="vertical" onFinish={(values) => login(values)} requiredMark={false}>
          <Form.Item
            label={text.auth.usernameLabel}
            name="username"
            rules={[{ required: true, message: text.auth.usernameRequired }]}
          >
            <Input size="large" placeholder="operator" autoComplete="username" />
          </Form.Item>

          <Form.Item
            label={text.auth.passwordLabel}
            name="password"
            rules={[{ required: true, message: text.auth.passwordRequired }]}
          >
            <Input.Password size="large" placeholder="••••••••" autoComplete="current-password" />
          </Form.Item>

          <ConfigProvider theme={ctaTheme}>
            <Button type="primary" htmlType="submit" size="large" block loading={isLoading}>
              {text.auth.submit}
            </Button>
          </ConfigProvider>
        </Form>
      </Card>
    </div>
  );
};
