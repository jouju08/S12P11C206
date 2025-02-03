import { useUser } from '@/store/userStore';
import React from 'react';
import { Link } from 'react-router-dom';

export default function DefaultHeader() {
  const { logout } = useUser();
  return (
    <header className="bg-main-background">
      <div className="w-[1024px] h-[100px] relative m-auto">
        {/* logo - 다음에 link 사이 img 넣기기 */}
        <Link
          to="/main"
          className="w-[200px] h-[70px] left-[60px] top-[15px] absolute bg-[#ffafaf]"
        />
        <div className="left-[488px] top-[35px] absolute service-bold3 text-text-first cursor-pointer hover:text-main-choose">
          <Link to="/tale/lobby">동화만들기</Link>
        </div>
        <div className="left-[638px] top-[35px] absolute service-bold3 text-text-first cursor-pointer hover:text-main-choose">
          <Link to="/upload">업로드</Link>
        </div>
        <div className="left-[788px] top-[35px] absolute service-bold3 text-text-first cursor-pointer hover:text-main-choose">
          <Link to="/gallery">갤러리</Link>
        </div>

        <div className=" left-[939px] top-[35px] absolute service-bold3 text-first cursor-pointer hover:text-main-choose">
          <button onClick={logout}> 그만하기</button>
        </div>
      </div>
    </header>
  );
}
