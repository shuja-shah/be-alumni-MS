import { BrowserRouter, Navigate, Outlet, useLocation, Route, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import { StyledChart } from './components/chart';
import ScrollToTop from './components/scroll-to-top';
import LoginPage from './pages/LoginPage';
import DashboardAppPage from './pages/DashboardAppPage';
import UserPage from './pages/UserPage';
import JobPage from './pages/ProductsPage';
import { useState } from 'react';
import { useEffect } from 'react';
import Page404 from './pages/Page404';
import RegisterPage from './pages/RegisterPage';
import SimpleLayout from './layouts/simple/SimpleLayout';
import DashboardLayout from './layouts/dashboard/DashboardLayout';
// ----------------------------------------------------------------------
function RequireAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const location = useLocation();
  // useEffect(() => {

  // setIsAuthenticated(!!token);
  // }, []);
  const token = localStorage.getItem('token');
  return token ? <Outlet /> : <Navigate to={{ pathname: '/login', state: { from: location } }} replace />;
}


export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ThemeProvider>
          <ScrollToTop />
          <StyledChart />
          <Routes>
            <Route exact path="/login" element={<LoginPage />} />
            <Route exact path="/register" element={<RegisterPage />} />
            <Route element={<RequireAuth />}>
              <Route element={<SimpleLayout />}>
                <Route element={<DashboardLayout />}>
                  <Route exact path="/" element={<DashboardAppPage />} />
                  <Route exact path="/users" element={<UserPage />} />
                  <Route exact path="/jobs" element={<JobPage />} />
                </Route>
              </Route>
            </Route>
            <Route exact path="*" element={<Page404 />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}
