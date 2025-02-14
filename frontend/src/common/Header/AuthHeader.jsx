import { useUser } from '@/store/userStore';
import React from 'react';
import { Link } from 'react-router-dom';

export default function AuthHeader() {
  const { logout } = useUser();

  return (
    <header>
      <nav className="w-[1024px] h-[100px] relative m-auto">
        {/* logo */}
        <Link
          to="/"
          className="w-[141px] h-[70px] left-1/2 top-1/2 absolute -translate-x-1/2 -translate-y-1/2">
          <img
            src="/Common/logo-blue.png"
            alt="로고"
            className="h-[70px]"
          />
        </Link>
        {/* <div className="left-[788px] top-[35px] absolute service-bold3 text-text-first cursor-pointer hover:text-main-choose">
          <Link to="/login">로그인</Link>
        </div> */}
      </nav>
    </header>
  );
}
