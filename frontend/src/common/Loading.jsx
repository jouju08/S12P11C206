/**
 * author : Lim Chaehyeon (chaehyeon)
 * data : 2025.02.18
 * description : 로딩 화면
 * React
 */

import React, { useRef, useEffect, useState } from 'react';

import '@/styles/loading.css';

export const Loading = () => {
  const parentRef = useRef(null);
  const [showImage, setShowImage] = useState(false);

  useEffect(() => {
    const checkHeight = () => {
      if (parentRef.current) {
        const height = parentRef.current.clientHeight;
        setShowImage(height >= 320);
      }
    };

    checkHeight(); // 초기 체크

    // 리사이즈 이벤트 리스너 추가
    window.addEventListener('resize', checkHeight);

    // 클린업 함수
    return () => window.removeEventListener('resize', checkHeight);
  }, []);

  return (
    <div
      ref={parentRef}
      className="w-full h-full flex flex-col gap-5 justify-center items-center"
      id="loading">
      {showImage && (
        <div>
          <img
            src="/Common/run-fairy.png"
            alt="로딩화면"
            className="w-[200px] h-[200px] shaking-image"
          />
        </div>
      )}
      <div className="font-NPSfont text-6xl text-text-first">
        <span>곧</span>
        <span className="w-[25px]"></span>
        <span>화</span>
        <span>면</span>
        <span>이</span>
        <span className="w-[25px]"></span>
        <span>나</span>
        <span>올</span>
        <span>거</span>
        <span>에</span>
        <span>요</span>
      </div>
    </div>
  );
};
