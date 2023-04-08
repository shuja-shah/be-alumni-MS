import { BrowserRouter, Navigate, Outlet, useLocation, Route, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
// routes
import { useState } from 'react';
import { useEffect } from 'react';
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import { StyledChart } from './components/chart';
import ScrollToTop from './components/scroll-to-top';
import LoginPage, { ENDPOINT } from './pages/LoginPage';
import DashboardAppPage from './pages/DashboardAppPage';
import UserPage from './pages/UserPage';
import JobPage from './pages/ProductsPage';
import Page404 from './pages/Page404';
import RegisterPage from './pages/RegisterPage';
import SimpleLayout from './layouts/simple/SimpleLayout';
import DashboardLayout from './layouts/dashboard/DashboardLayout';
import MyProfile from './pages/ProfilePage';
import Channels from './pages/Channels';
import Chat from './pages/Chat';
import LandingPage from './LandingPage';
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
const myToken = localStorage.getItem('token');

const userFetch = async () => {
  const req = await fetch(`${ENDPOINT}/api/users/self`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${myToken}`,
    },
  });
  const data = await req.json();

  if (!req.ok) {
    console.log('No Fetch User', data);
    return false;
  }
  localStorage.setItem('user', JSON.stringify(data));
  return data;
};
export default function App() {
  useEffect(() => {
    userFetch();
  }, []);
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ThemeProvider>
          <ScrollToTop />
          <StyledChart />
          <Routes>
            <Route exact path="/home" element={<LandingPage />} />
            <Route exact path="/login" element={<LoginPage />} />
            <Route exact path="/register" element={<RegisterPage />} />

            <Route element={<RequireAuth />}>
              <Route element={<SimpleLayout />}>
                <Route element={<DashboardLayout />}>
                  <Route exact path="/" element={<DashboardAppPage />} />
                  <Route exact path="/users" element={<UserPage />} />
                  <Route exact path="/jobs" element={<JobPage />} />
                  <Route exact path="/profile" element={<MyProfile />} />
                  <Route exact path="/channel" element={<Channels />} />
                  <Route exact path="/chat" element={<Chat />} />
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
