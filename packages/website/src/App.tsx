import 'react-perfect-scrollbar/dist/css/styles.css';
import { Navigate, useRoutes } from 'react-router';
import MainLayout from './layouts/MainLayout';
import LoginView from './views/Login';
import { ThemeProvider } from '@material-ui/core';
import GlobalStyles from './components/GlobalStyles';
import theme from './theme';
import React from 'react';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardView from './views/Dashboard';
import JobsView from './views/Jobs';
function App() {
  const routing = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { path: '/home', element: <DashboardView /> },
        { path: '/jobs', element: <JobsView /> },
        { path: '/', element: <Navigate to="/dashboard/home" /> },
        { path: '*', element: <Navigate to="/dashboard/home" /> },
      ],
    },
    {
      path: '/',
      element: <MainLayout />,
      children: [
        {
          path: 'login',
          element: <LoginView />,
        },
        {
          path: '*',
          element: <Navigate to="/login" />,
        },
        {
          path: '/',
          element: <Navigate to="/login" />,
        },
      ],
    },
  ]);
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      {routing}
    </ThemeProvider>
  );
}

export default App;
