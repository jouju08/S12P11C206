import React, { useState } from 'react';
import KeywordMenu from './KeywordMenu';

export default function KeywordInput({ type, isActive, onclickEvent }) {
  const typeKR = [
    { type: 'typing', kr: '타자' },
    { type: 'voice', kr: '목소리' },
    { type: 'handwrite', kr: '글쓰기' },
  ];

  return (
    <div className="p-2 service-bold3 flex flex-col justify-between items-center rounded-[2.3rem] w-[8.75rem] h-[5.55rem] text-text-first bg-main-btn">
      <button>
        <img src="/Common/fill-heart.png" />
      </button>
      <button onClick={onclickEvent}>
        <span>{typeKR.find((item) => item.type === type)?.['kr']}</span>
      </button>
    </div>
  );
}
