import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Footer from '../Footer';
import AuthHeader from '../Header/AuthHeader';
import DefaultHeader from '../Header/DefaultHeader';
import { useUser } from '@/store/userStore';
import Friends from '@/components/Friend/Friend';

export default function MainLayout() {
  const { isAuthenticated } = useUser();
  const location = useLocation();
  const [showFriend, setShowFriend] = useState(false);

  const isCollectionPage = location.pathname === '/collection';

  return (
    <div
      className={`relative ${isCollectionPage ? 'bg-main-beige' : 'bg-main-background'}`}>
      {isAuthenticated ? (
        <AuthHeader
          showFriend={showFriend}
          setShowFriend={setShowFriend}
        />
      ) : (
        <DefaultHeader />
      )}

      {/* background option */}
      {isCollectionPage ? (
        <img
          src="/Collection/field-background.png"
          alt="collection 배경"
          className="absolute top-[100px] left-0 w-full h-[682px]"
        />
      ) : null}

      {/* 최소 높이 주는 css 삭제 */}
      <div className="relative flex w-3/4 justify-center items-center mx-auto border-solid border-2 border-indigo-600">
        <Outlet />
      </div>
      {showFriend && (
        <div className="absolute top-[110px] right-1/4 z-50">
          <Friends />
        </div>
      )}
      <Footer />
    </div>
  );
}
