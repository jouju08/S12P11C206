import React, { Suspense, lazy, useEffect } from 'react';
import MainLayout from '@/common/layout/MainLayout';
import TaleLayout from '@/common/layout/TaleLayout';
import { Loading } from '@/common/Loading';
import { useUser } from '@/store/userStore';

import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
  useLocation,
} from 'react-router-dom';
import KakaoCallback from '@/components/kakao/KakaoCallback';

const Hero = lazy(() => import('@/pages/User/Hero'));
const Login = lazy(() => import('@/pages/User/Login'));
const Main = lazy(() => import('@/pages/User/Main'));
const Room = lazy(() => import('@/pages/User/Room'));
const Collection = lazy(() => import('@/pages/User/Collection'));
const Gallery = lazy(() => import('@/pages/User/Gallery'));
const Profile = lazy(() => import('@/pages/User/Profile'));
const FileTest = lazy(() => import('@/pages/FileTest'));
const Lobby = lazy(() => import('@/pages/Room/Lobby'));
const Share = lazy(() => import('@/pages/Room/Share'));
const TaleStart = lazy(() => import('@/pages/Room/TaleStart'));
const TaleKeyword = lazy(() => import('@/pages/Room/TaleKeyword'));

//인증된 사용자
const ProtectedLayout = () => {
  const { isAuthenticated, fetchUser } = useUser();
  const location = useLocation();

  useEffect(() => {
    fetchUser();
  }, [location.pathname]);

  return isAuthenticated ? (
    <Suspense fallback={<Loading />}>
      <Outlet />
    </Suspense>
  ) : (
    <Navigate
      to="/login"
      replace
    />
  );
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Hero /> },
      { path: 'login', element: <Login /> },
      { path: 'auth/kakao/callback', element: <KakaoCallback /> },
      {
        element: <ProtectedLayout />, // 인증된 사용자
        children: [
          { path: 'main', element: <Main /> },
          { path: 'room', element: <Room /> },
          { path: 'collection', element: <Collection /> },
          { path: 'gallery', element: <Gallery /> },
          { path: 'profile', element: <Profile /> },
          { path: 'upload', element: <FileTest /> },
        ],
      },
    ],
  },
  {
    path: 'tale',
    element: <TaleLayout />,
    children: [
      {
        element: <ProtectedLayout />, // 인증된 사용자
        children: [
          { path: 'lobby', element: <Lobby /> },
          { path: 'share', element: <Share /> },
          { path: 'taleStart', element: <TaleStart /> },
          { path: 'taleKeyword', element: <TaleKeyword /> },
        ],
      },
    ],
  },
]);

export default function AppRouter() {
  return (
    <Suspense fallback={<Loading />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}
