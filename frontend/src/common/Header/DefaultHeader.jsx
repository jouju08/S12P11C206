import { useUser } from '@/store/userStore';
import React from 'react';
import { Link } from 'react-router-dom';

export default function AuthHeader() {
  const { logout } = useUser();

  return (
    <header className="sticky top-0 z-50">
      <nav className="w-[1024px] h-[100px] relative m-auto">
        {/* logo */}
        <Link
          to="/main"
          className="w-[141px] h-[70px] left-[60px] top-[15px] absolute">
          <img
            src="/Common/logo-blue.png"
            alt="로고"
            className="h-[70px]"
          />
        </Link>
        <div className="left-[788px] top-[35px] absolute service-bold3 text-text-first cursor-pointer hover:text-main-choose">
          <Link to="/login">로그인</Link>
        </div>
      </nav>
    </header>
  );
}
