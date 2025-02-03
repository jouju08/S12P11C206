import React from 'react';

export default function TaleRoomHeader({ onClose }) {
  return (
    <header className="bg-main-background shadow-md sticky top-0 z-50">
      <nav className="w-[1024px] h-[100px] px-[20px] flex flex-row justify-between mx-auto items-center">
        {/* logo - 다음에 link 사이 img 넣기기 */}
        <div className="w-[200px] h-[70px] bg-[#ffafaf]">로고</div>
        {/* 책 이름 가져오기 */}
        <div className="text-text-first service-accent1">책 제목</div>
        <div
          onClick={onClose}
          className="bg-red-400 w-[160px] h-[70px]">
          나가기
        </div>
      </nav>
    </header>
  );
}
