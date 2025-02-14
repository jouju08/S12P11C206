import { useState, useRef, useEffect } from 'react';
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
  const friendsRef = useRef(null);

  const isCollectionPage = location.pathname === '/collection';
  const isHeroPage = location.pathname === '/';

  // useEffect(() => {
  //   function handleClickOutside(event) {
  //     if (friendsRef.current && !friendsRef.current.contains(event.target)) {
  //       setShowFriend(false);
  //     }
  //   }

  //   document.addEventListener('mousedown', handleClickOutside);
  //   return () => {
  //     document.removeEventListener('mousedown', handleClickOutside);
  //   };
  // }, [friendsRef]);

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

      {/* 최소 높이 주는 w-3/4 css 삭제 */}
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
