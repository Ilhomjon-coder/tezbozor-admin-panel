import { Authenticated, Refine } from '@refinedev/core';
import { ThemedLayoutV2, useNotificationProvider } from '@refinedev/antd';
import routerBindings, { CatchAllNavigate } from '@refinedev/react-router-v6';
import dataProvider from '@refinedev/simple-rest';
import { App as AntdApp, ConfigProvider } from 'antd';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';

import '@refinedev/antd/dist/reset.css';
import { antdTheme } from './theme';
import { authProvider } from './providers/authProvider';
import { LoginPage } from './pages/login';
import { DashboardPage } from './pages/dashboard';

const API_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api';

export default function App() {
  return (
    <BrowserRouter>
      <ConfigProvider theme={antdTheme}>
        <AntdApp>
          <Refine
            dataProvider={dataProvider(API_URL)}
            authProvider={authProvider}
            routerProvider={routerBindings}
            notificationProvider={useNotificationProvider}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
              title: { text: 'Tezbozor' },
            }}
          >
            <Routes>
              {/* Authenticated area: dashboard inside the admin shell. */}
              <Route
                element={
                  <Authenticated key="authenticated-routes" fallback={<CatchAllNavigate to="/login" />}>
                    <ThemedLayoutV2>
                      <Outlet />
                    </ThemedLayoutV2>
                  </Authenticated>
                }
              >
                <Route index element={<DashboardPage />} />
              </Route>

              {/* Public area: login stub. Already-authed users skip to dashboard. */}
              <Route
                element={
                  <Authenticated key="public-routes" fallback={<Outlet />}>
                    <CatchAllNavigate to="/" />
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
