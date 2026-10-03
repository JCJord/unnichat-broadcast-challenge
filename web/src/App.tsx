import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, StyledEngineProvider, GlobalStyles } from '@mui/material';
import { muiTheme } from './theme/muiTheme';
import { AuthProvider } from './core/auth/AuthProvider';
import { ProtectedRoute } from './core/auth/ProtectedRoute';
import { PublicRoute } from './core/auth/PublicRoute';
import { ConnectionProvider } from './core/connections/ConnectionProvider';
import { LoginPage } from './features/auth/pages/LoginPage';
import { RegisterPage } from './features/auth/pages/RegisterPage';
import { Layout } from './shared/components/layout/Layout';
import { ConnectionsPage } from './features/connections/pages/ConnectionsPage';
import { ContactsPage } from './features/contacts/pages/ContactsPage';
import { BroadcastPage } from './features/broadcast/pages/BroadcastPage';

export function App() {
  return (
    <StyledEngineProvider enableCssLayer>
      <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<PublicRoute />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </Route>

              <Route element={<ProtectedRoute />}>
                <Route
                  element={
                    <ConnectionProvider>
                      <Layout />
                    </ConnectionProvider>
                  }
                >
                  <Route path="/connections" element={<ConnectionsPage />} />
                  <Route path="/contacts" element={<ContactsPage />} />
                  <Route path="/broadcast" element={<BroadcastPage />} />
                </Route>
              </Route>

              <Route path="*" element={<Navigate to="/connections" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
