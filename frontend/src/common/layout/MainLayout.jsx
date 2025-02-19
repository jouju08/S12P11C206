/**
 * author : Lim Chaehyeon (chaehyeon)
 * data : 2025.02.18
 * description : 메인 레이아웃
 * React
 */

import { useState, useRef, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AuthHeader from '../Header/AuthHeader';
import DefaultHeader from '../Header/DefaultHeader';
import { useUser } from '@/store/userStore';
import Friends from '@/components/Friend/Friend';

export default function MainLayout() {
  const { isAuthenticated } = useUser();
  const location = useLocation();
  const [showFriend, setShowFriend] = useState(false);
  const friendsRef = useRef(null);

  const isCollectionPage = location.pathname === '/collection';
  const isHeroPage = location.pathname === '/';
  const isLoginPage = location.pathname === '/login';
  const isRegisterPage = location.pathname === '/register';
  const isFindIdPage = location.pathname === '/findid';
  const isFindPWPage = location.pathname === '/findpw';


  return (
    <div
      className={`relative min-h-screen ${isCollectionPage ? 'bg-main-beige' : 'bg-main-background'}`}>
      {isAuthenticated ? (
        <DefaultHeader
          showFriend={showFriend}
          setShowFriend={setShowFriend}
        />
      ) : isHeroPage ? null : (
        <AuthHeader />
      )}

      {/* background option */}
      {isCollectionPage ? (
        <img
          src="/Collection/field-background.png"
          alt="collection 배경"
          className="absolute bottom-0 left-0 w-full h-[682px] object-cover"
        />
      ) : null}
      {isLoginPage ? (
        <img
          src="/Login/login-background.png"
          alt="login 배경"
          className="absolute bottom-0 left-0 object-contain"
        />
      ) : null}
      {isRegisterPage ? (
        <img
          src="/Login/login-background.png"
          alt="register 배경"
          className="absolute bottom-0 left-0 object-contain"
        />
      ) : null}
      {isFindIdPage ? (
        <img
          src="/Login/login-background.png"
          alt="findId 배경"
          className="absolute bottom-0 left-0 object-contain"
        />
      ) : null}
      {isFindPWPage ? (
        <img
          src="/Login/login-background.png"
          alt="findPW 배경"
          className="absolute bottom-0 left-0 object-contain"
        />
      ) : null}

      <div className="relative flex justify-center items-center mx-auto">
        <Outlet />
      </div>
      {showFriend && (
        <div
          ref={friendsRef}
          className={`fixed top-[0px] right-0 z-50 transition-transform duration-300 ease-in-out transform ${
            showFriend ? 'translate-x-0' : '-translate-x-full'
          }`}>
          <Friends
            showFriend={showFriend}
            setShowFriend={setShowFriend}
          />
        </div>
      )}
    </div>
  );
}
