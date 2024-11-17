import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout';
import LandingPage from '../pages/LandingPage/LandingPage';
import SignUpPage from '../pages/SignUpPage/SignUpPage';
import LoginPage from '../pages/LoginPage/LoginPage';
import ChattingPage from '../pages/ChattingPage/ChattingPage';
import ChartPage from '../pages/ChartPage/ChartPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '/', element: <LandingPage /> },
      { path: 'signUp', element: <SignUpPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'chat', element: <ChattingPage /> },
      { path: 'chart', element: <ChartPage /> },
    ],
  },
]);

export default router;