import React, { useState } from 'react';
import { Routes, Route, MemoryRouter } from 'react-router-dom';
import { AppSettingsContext, useAppSettings } from './theme';
import { CssBaseline, ThemeProvider } from '@mui/material';
// pages
import TopBar from './pages/global/TopBar';
import SideBar from './pages/global/SideBar';
import Dashboard from './pages/dashboard';

// rtl
import rtlPlugin from 'stylis-plugin-rtl';
import { CacheProvider } from '@emotion/react';

import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import AddReport from './pages/addreport';
import ReportsTable from './pages/table';
import ReportBrowser from './pages/reportsbrowser';
import Search from './pages/search';
import { SnackbarProvider } from 'notistack';
import ViewReport from './pages/viewreport';
import ProtectedRoute from './components/protected';
import Login from './pages/login';

const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

function RTL(props) {
  return <CacheProvider value={cacheRtl}>{props.children}</CacheProvider>;
}
export default function App() {
  const { theme, appSettings } = useAppSettings();
  const [logged, setLogged] = useState(!0);

  return (
    <MemoryRouter>
      <RTL>
        <AppSettingsContext.Provider value={appSettings}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <SnackbarProvider maxSnack={3}>
              <div className="app">
                <SideBar />
                <div className="content">
                  <TopBar />
                  <Routes>
                    <Route
                      path="/login"
                      element={<Login user={logged} setLogged={setLogged} />}
                    />
                    <Route
                      path="/"
                      element={
                        <ProtectedRoute
                          user={logged}
                          children={<Dashboard />}
                        />
                      }
                    />
                    <Route
                      path="/addreport"
                      element={
                        <ProtectedRoute
                          user={logged}
                          children={<AddReport />}
                        />
                      }
                    />

                    <Route
                      path="/addreport/:path"
                      element={
                        <ProtectedRoute
                          user={logged}
                          children={<AddReport />}
                        />
                      }
                    />

                    <Route
                      path="/reportstable"
                      element={
                        <ProtectedRoute
                          user={logged}
                          children={<ReportsTable />}
                        />
                      }
                    />

                    <Route
                      path="/reports/:id"
                      element={
                        <ProtectedRoute
                          user={logged}
                          children={<ViewReport />}
                        />
                      }
                    />

                    <Route
                      path="/browsefolders"
                      element={
                        <ProtectedRoute
                          user={logged}
                          children={<ReportBrowser />}
                        />
                      }
                    />

                    <Route
                      path="/search"
                      element={
                        <ProtectedRoute user={logged} children={<Search />} />
                      }
                    />
                  </Routes>
                </div>
              </div>
            </SnackbarProvider>
          </ThemeProvider>
        </AppSettingsContext.Provider>
      </RTL>
    </MemoryRouter>
  );
}
