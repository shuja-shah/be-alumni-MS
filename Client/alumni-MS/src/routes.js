import { useState, useEffect } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import BlogPage from './pages/BlogPage';
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';

// ----------------------------------------------------------------------


export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  return { isAuthenticated };
}


export default function Router() {
  const { isAuthenticated } = useAuth(); // <== CUSTOM HOOK
  const routes = useRoutes(
    isAuthenticated ?
      [
        {
          path: '/dashboard',
          element: <DashboardLayout />,
          children: [
            { element: <Navigate to="/dashboard/app" />, index: true },
            { path: 'app', element: <DashboardAppPage /> },
            { path: 'user', element: <UserPage /> },
            { path: 'products', element: <ProductsPage /> },
            { path: 'blog', element: <BlogPage /> },
          ],
        },
        {
          path: 'login',
          element: <LoginPage />,
        },
        {
          element: <SimpleLayout />,
          children: [
            { element: <Navigate to="/dashboard/app" />, index: true },
            { path: '404', element: <Page404 /> },
            { path: '*', element: <Navigate to="/404" /> },
          ],
        },
        {
          path: '*',
          element: <Navigate to="/404" replace />,
        },
      ] : [
        {
          path: 'login',
          element: <LoginPage />,
        },
      ]);

  return routes;
}
