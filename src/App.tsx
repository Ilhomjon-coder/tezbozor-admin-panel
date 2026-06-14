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
  ShoppingCartOutlined,
  TagsOutlined,
} from '@ant-design/icons';
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';

import '@refinedev/antd/dist/reset.css';
import { antdTheme } from './theme';
import { authProvider } from './providers/authProvider';
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

export default function App() {
  return (
    <BrowserRouter>
      <ConfigProvider theme={antdTheme}>
        <AntdApp>
          <Refine
            dataProvider={dataProvider}
            authProvider={authProvider}
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
                    <ThemedLayoutV2>
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
