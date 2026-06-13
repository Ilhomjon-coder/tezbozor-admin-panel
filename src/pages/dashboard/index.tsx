import { Card, Typography } from 'antd';

const { Title, Paragraph } = Typography;

// Phase 0 empty dashboard. Real screens (daily price editor, orders, route
// page, data dashboards) arrive in Phase 2 and Phase 5.
export const DashboardPage = () => (
  <Card variant="borderless">
    <Title level={3}>Boshqaruv paneli</Title>
    <Paragraph type="secondary">
      Tezbozor operatorlari paneli. Bu yerda tez orada kunlik narxlar, buyurtmalar va
      yetkazib berish marshruti paydo bo'ladi.
    </Paragraph>
  </Card>
);
