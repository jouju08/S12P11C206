import MainLayout from '@/common/layout/MainLayout';
import TaleLayout from '@/common/layout/TaleLayout';
import { Loading } from '@/common/Loading';

import Hero from '@/pages/Hero';
import Login from '@/pages/Login';
import Main from '@/pages/Main';
import Share from '@/pages/Share';
import React, { Suspense } from 'react';
import {
  BrowserRouter,
  createBrowserRouter,
  Route,
  RouterProvider,
  Routes,
} from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loading />}>
            <Hero />
          </Suspense>
        ),
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'main',
        element: <Main />,
      },
    ],
  },
  {
    path: 'tale',
    element: <TaleLayout />,
    children: [
      {
        path: 'share',
        element: <Share />,
      },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
