import MainLayout from '@/common/layout/MainLayout';
import TaleLayout from '@/common/layout/TaleLayout';
import { Loading } from '@/common/Loading';

import Hero from '@/pages/User/Hero';
import Login from '@/pages/User/Login';
import Main from '@/pages/User/Main';
import Share from '@/pages/Room/Share';
import Room from '@/pages/User/Room';
import Collection from '@/pages/User/Collection';
import Gallery from '@/pages/User/Gallery';
import Profile from '@/pages/User/Profile';

import React, { Suspense } from 'react';
import {
  BrowserRouter,
  createBrowserRouter,
  Route,
  RouterProvider,
  Routes,
} from 'react-router-dom';
import FileTest from '@/pages/FileTest';
import Lobby from '@/pages/Room/Lobby';

// Suspense Lazy Wrapper
const withSuspense = (Component) => (
  <Suspense fallback={<Loading />}>
    <Component />
  </Suspense>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />, // header(common header, auth header), footer
    children: [
      {
        index: true,
        element: withSuspense(Hero),
      },
      {
        path: 'login',
        element: withSuspense(Login),
      },
      {
        path: 'main',
        element: withSuspense(Main),
      },
      {
        path: 'room',
        element: withSuspense(Room),
      },
      {
        path: 'collection',
        element: withSuspense(Collection),
      },
      {
        path: 'gallery',
        element: withSuspense(Gallery),
      },
      {
        path: 'profile',
        element: withSuspense(Profile),
      },
      {
        path: 'upload',
        element: withSuspense(FileTest),
      },
    ],
  },
  {
    path: 'tale',
    element: <TaleLayout />,
    children: [
      {
        path: 'lobby',
        element: withSuspense(Lobby),
      },
      {
        path: 'share',
        element: withSuspense(Share),
      },
    ],
  },
  {},
]);

export default function AppRouter() {
  return (
    <Suspense fallback={<Loading />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}
