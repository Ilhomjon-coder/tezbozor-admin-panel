import { Authenticated, Refine } from '@refinedev/core';
import { ThemedLayoutV2, useNotificationProvider } from '@refinedev/antd';
import routerBindings, {
  CatchAllNavigate,
  NavigateToResource,
} from '@refinedev/react-router-v6';
import { App as AntdApp, ConfigProvider } from 'antd';
import {
  AppstoreOutlined,
  CarOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  TagsOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';

import '@refinedev/antd/dist/reset.css';
import { buildTheme } from './theme';
import { ColorModeProvider, useColorMode } from './providers/color-mode';
import { Header } from './components/Header';
import { Title } from './components/Title';
import { authProvider } from './providers/authProvider';
import { accessControlProvider } from './providers/access';
import { dataProvider } from './api/dataProvider';
import { text } from './i18n/uz';

import { LoginPage } from './pages/login';
import { DailyPricesPage } from './pages/daily-prices';
import { OrdersListPage } from './pages/orders/list';
import { OrderShowPage } from './pages/orders/show';
import { RoutePage } from './pages/route';
import { ProductsListPage } from './pages/products/list';
import { ProductCreatePage } from './pages/products/create';
import { ProductEditPage } from './pages/products/edit';
import { CategoriesListPage } from './pages/categories/list';
import { CategoryCreatePage } from './pages/categories/create';
import { CategoryEditPage } from './pages/categories/edit';
import { SlotsListPage } from './pages/slots/list';
import { SlotCreatePage } from './pages/slots/create';
import { SlotEditPage } from './pages/slots/edit';
import { AdminsListPage } from './pages/admins/list';
import { AdminCreatePage } from './pages/admins/create';
import { AdminEditPage } from './pages/admins/edit';
import { RolesListPage } from './pages/roles/list';
import { RoleCreatePage } from './pages/roles/create';
import { RoleEditPage } from './pages/roles/edit';

export default function App() {
  return (
    <ColorModeProvider>
      <ThemedApp />
    </ColorModeProvider>
  );
}

function ThemedApp() {
  const { mode } = useColorMode();
  return (
    <BrowserRouter>
      <ConfigProvider theme={buildTheme(mode)}>
        <AntdApp>
          <Refine
            dataProvider={dataProvider}
            authProvider={authProvider}
            accessControlProvider={accessControlProvider}
            routerProvider={routerBindings}
            notificationProvider={useNotificationProvider}
            resources={[
              {
                name: 'daily-prices',
                list: '/daily-prices',
                meta: { label: text.nav.dailyPrices, icon: <DollarOutlined /> },
              },
              {
                name: 'orders',
                list: '/orders',
                show: '/orders/:id',
                meta: { label: text.nav.orders, icon: <ShoppingCartOutlined /> },
              },
              {
                name: 'route',
                list: '/route',
                meta: { label: text.nav.route, icon: <CarOutlined /> },
              },
              {
                name: 'products',
                list: '/products',
                create: '/products/new',
                edit: '/products/:id/edit',
                meta: { label: text.nav.products, icon: <AppstoreOutlined /> },
              },
              {
                name: 'categories',
                list: '/categories',
                create: '/categories/new',
                edit: '/categories/:id/edit',
                meta: { label: text.nav.categories, icon: <TagsOutlined /> },
              },
              {
                name: 'slots',
                list: '/slots',
                create: '/slots/new',
                edit: '/slots/:id/edit',
                meta: { label: text.nav.slots, icon: <ClockCircleOutlined /> },
              },
              // Administration group (auto-hidden by accessControl for users
              // without the perms).
              {
                name: 'administration',
                meta: { label: text.nav.administration, icon: <SettingOutlined /> },
              },
              {
                name: 'admins',
                list: '/admins',
                create: '/admins/new',
                edit: '/admins/:id/edit',
                meta: { label: text.nav.admins, icon: <TeamOutlined />, parent: 'administration' },
              },
              {
                name: 'roles',
                list: '/roles',
                create: '/roles/new',
                edit: '/roles/:id/edit',
                meta: { label: text.nav.roles, icon: <SafetyCertificateOutlined />, parent: 'administration' },
              },
              // Read-only catalog used by the role editor; not shown in the menu.
              { name: 'permissions' },
            ]}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
              title: { text: text.app.title },
            }}
          >
            <Routes>
              <Route
                element={
                  <Authenticated key="authenticated-routes" fallback={<CatchAllNavigate to="/login" />}>
                    <ThemedLayoutV2 Header={Header} Title={Title}>
                      <Outlet />
                    </ThemedLayoutV2>
                  </Authenticated>
                }
              >
                {/* The daily price ritual is the operator's landing screen. */}
                <Route index element={<Navigate to="/daily-prices" replace />} />
                <Route path="/daily-prices" element={<DailyPricesPage />} />

                <Route path="/orders" element={<OrdersListPage />} />
                <Route path="/orders/:id" element={<OrderShowPage />} />

                <Route path="/route" element={<RoutePage />} />

                <Route path="/products" element={<ProductsListPage />} />
                <Route path="/products/new" element={<ProductCreatePage />} />
                <Route path="/products/:id/edit" element={<ProductEditPage />} />

                <Route path="/categories" element={<CategoriesListPage />} />
                <Route path="/categories/new" element={<CategoryCreatePage />} />
                <Route path="/categories/:id/edit" element={<CategoryEditPage />} />

                <Route path="/slots" element={<SlotsListPage />} />
                <Route path="/slots/new" element={<SlotCreatePage />} />
                <Route path="/slots/:id/edit" element={<SlotEditPage />} />

                <Route path="/admins" element={<AdminsListPage />} />
                <Route path="/admins/new" element={<AdminCreatePage />} />
                <Route path="/admins/:id/edit" element={<AdminEditPage />} />

                <Route path="/roles" element={<RolesListPage />} />
                <Route path="/roles/new" element={<RoleCreatePage />} />
                <Route path="/roles/:id/edit" element={<RoleEditPage />} />
              </Route>

              <Route
                element={
                  <Authenticated key="public-routes" fallback={<Outlet />}>
                    <NavigateToResource resource="daily-prices" />
                  </Authenticated>
                }
              >
                <Route path="/login" element={<LoginPage />} />
              </Route>
            </Routes>
          </Refine>
        </AntdApp>
      </ConfigProvider>
    </BrowserRouter>
  );
}
