import React from 'react';
import { Link } from 'react-router-dom';

export default function DefaultHeader() {
  return (
    <header className="bg-main-background">
      <div className="w-[1024px] h-[100px] relative m-auto">
        {/* logo - 다음에 link 사이 img 넣기기 */}
        <Link
          to="/main"
          className="w-[200px] h-[70px] left-[60px] top-[15px] absolute bg-[#ffafaf]"
        />
        <div className="left-[788px] top-[35px] absolute service-bold3 text-first cursor-pointer hover:text-main-choose">
          친구목록
        </div>
        <div className=" left-[889px] top-[35px] absolute service-bold3 text-first cursor-pointer hover:text-main-choose">
          그만하기
        </div>
      </div>
    </header>
  );
}
