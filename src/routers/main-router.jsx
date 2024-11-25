import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout';
import LandingPage from '../pages/LandingPage/LandingPage';
import SignUpPage from '../pages/SignUpPage/SignUpPage';
import LoginPage from '../pages/LoginPage/LoginPage';
import ChattingPage from '../pages/ChattingPage/ChattingPage';
import StockChartPage from '../pages/StockChartPage/StockChartPage';
import KeywordChartPage from '../pages/KeywordChartPage/KeywordChartPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '/', element: <LandingPage /> },
      { path: 'signUp', element: <SignUpPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'chat', element: <ChattingPage /> },
      { path: 'stock/:stock_id/:chart_period', element: <StockChartPage /> },
      { path: 'keyword/:keyword_id', element: <KeywordChartPage /> },
    ],
  },
]);

export default router;
