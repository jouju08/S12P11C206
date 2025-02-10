import React, { useRef, useEffect, useState } from 'react';

import '@/styles/loading.css';

export const Loading = () => {
  return (
    // <div
    //   className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
    //   role="status">
    //   <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
    //     Loading...
    //   </span>
    // </div>
    <div
      className="w-full h-full flex flex-col gap-5 justify-center items-center"
      id="loading">
      <div>
        <img
          src="/Common/run-fairy.png"
          alt="로딩화면"
          className="w-[200px] h-[200px] shaking-image"
        />
      </div>
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
