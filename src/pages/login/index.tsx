import { useLogin } from '@refinedev/core';
import { Button, Card, ConfigProvider, Form, Input, Typography } from 'antd';
import { brand, ctaTheme } from '../../theme';

const { Title, Text } = Typography;

// Phase 0 login STUB. Renders a branded form; submit calls the stub
// authProvider (any credentials succeed) and redirects to the dashboard.
// The submit button uses the orange CTA theme; everything else is brand green.
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
            Tezbozor
          </Title>
          <Text type="secondary">Boshqaruv paneli</Text>
        </div>

        <Form layout="vertical" onFinish={(values) => login(values)} requiredMark={false}>
          <Form.Item
            label="Foydalanuvchi nomi"
            name="username"
            rules={[{ required: true, message: 'Foydalanuvchi nomini kiriting' }]}
          >
            <Input size="large" placeholder="operator" autoComplete="username" />
          </Form.Item>

          <Form.Item
            label="Parol"
            name="password"
            rules={[{ required: true, message: 'Parolni kiriting' }]}
          >
            <Input.Password size="large" placeholder="••••••••" autoComplete="current-password" />
          </Form.Item>

          <ConfigProvider theme={ctaTheme}>
            <Button type="primary" htmlType="submit" size="large" block loading={isLoading}>
              Kirish
            </Button>
          </ConfigProvider>
        </Form>

        <Text type="secondary" style={{ display: 'block', marginTop: 16, fontSize: 13 }}>
          Demo rejimi — haqiqiy autentifikatsiya keyingi bosqichda qo'shiladi.
        </Text>
      </Card>
    </div>
  );
};
