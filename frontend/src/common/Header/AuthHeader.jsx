/**
 * author : Lim Chaehyeon (chaehyeon)
 * data : 2025.02.18
 * description : 헤더
 * React
 */

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
      </nav>
    </header>
  );
}
