import React, { Suspense, lazy, useEffect } from 'react';
import MainLayout from '@/common/layout/MainLayout';
import TaleLayout from '@/common/layout/TaleLayout';
import { Loading } from '@/common/Loading';
import { useUser } from '@/store/userStore';
import Admin from '@/pages/Admin';

import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
  useLocation,
} from 'react-router-dom';

import KakaoCallback from '@/components/kakao/KakaoCallback';
import Friends from '@/components/Friend/Friend';

const Hero = lazy(() => import('@/pages/User/Hero'));
const Login = lazy(() => import('@/pages/User/Login'));
const Register = lazy(() => import('@/pages/User/Register'));
const Main = lazy(() => import('@/pages/User/Main'));
const Room = lazy(() => import('@/pages/User/Room'));
const Collection = lazy(() => import('@/pages/User/Collection'));
const Gallery = lazy(() => import('@/pages/User/Gallery'));
const GalleryDetail = lazy(() => import('@/pages/User/GalleryDetail'));
const Profile = lazy(() => import('@/pages/User/Profile'));
const Sightseeing = lazy(() => import('@/pages/User/Sightseeing'));
const TaleStart = lazy(() => import('@/pages/Room/TaleStart'));
const TaleKeyword = lazy(() => import('@/pages/Room/TaleKeyword'));
const FindId = lazy(() => import('@/components/user/FindId'));
const FindPw = lazy(() => import('@/components/user/FindPassword'));
const TaleSentenceDrawing = lazy(
  () => import('@/pages/Room/TaleSentenceDrawing')
);
const HotTale = lazy(() => import('@/pages/Room/HotTale'));
const Waiting = lazy(() => import('@/pages/Room/Waiting'));

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
      { path: 'register', element: <Register /> },
      { path: 'auth/kakao/callback', element: <KakaoCallback /> },
      { path: 'findid', element: <FindId /> },
      { path: 'findpw', element: <FindPw /> },

      {
        element: <ProtectedLayout />, // 인증된 사용자
        children: [
          { path: 'main', element: <Main /> },
          { path: 'room', element: <Room /> },
          { path: 'collection', element: <Collection /> },
          { path: 'gallery', element: <Gallery /> },
          { path: 'gallery/:galleryId', element: <GalleryDetail /> },
          { path: 'profile', element: <Profile /> },
          { path: 'sightseeing', element: <Sightseeing /> },
          { path: 'admin', element: <Admin /> },
          { path: 'friends', element: <Friends /> },
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
          { path: 'waiting', element: <Waiting /> },
          { path: 'taleStart', element: <TaleStart /> },
          { path: 'taleKeyword', element: <TaleKeyword /> },
          { path: 'taleSentenceDrawing', element: <TaleSentenceDrawing /> },
          { path: 'hotTale', element: <HotTale /> },
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
