import { logout } from '@/apis/auth/testAPI';
import { useUser } from '@/store/userStore';
import React from 'react';
import { Link } from 'react-router-dom';

export default function AuthHeader() {
  const { logout } = useUser();

  return (
    <header className="bg-main-background shadow-md sticky top-0 z-50">
      <nav className="w-[1024px] h-[100px] relative m-auto">
        {/* logo - 다음에 link 사이 img 넣기기 */}
        <Link
          to="/main"
          className="w-[200px] h-[70px] left-[60px] top-[15px] absolute bg-[#ffafaf]"
        />
        <div className="left-[788px] top-[35px] absolute service-bold3 text-text-first cursor-pointer hover:text-main-choose">
          <Link to="/login">로그인</Link>
        </div>

        {/* Menu */}
        {/* <ul className="hidden md:flex space-x-6">
            <li>
              <Link
                to="/main"
                className="text-gray-700 hover:text-blue-600 text-xl">
                Main
              </Link>
            </li>
            <li>
              <Link
                to="/tale/share"
                className="text-gray-700 hover:text-blue-600 text-xl">
                Share
              </Link>
            </li>
            <li>
              <Link
                to="/upload"
                className="text-gray-700 hover:text-blue-600 text-xl">
                File
              </Link>
            </li>
            <li>
              <Link
                to="tale/lobby"
                className="text-gray-700 hover:text-blue-600 text-xl">
                Lobby
              </Link>
            </li>
          </ul> */}
      </nav>
    </header>
  );
}
