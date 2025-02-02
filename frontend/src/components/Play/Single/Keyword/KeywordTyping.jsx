import React, { useState } from 'react';
import KeywordMenu from './KeywordMenu';
import { useTalePlay } from '@/store/tale/playStore';

export default function KeywordTyping({ back, next, reload }) {
  const [inputValue, setInputValue] = useState('');
  const { setCurrentKeyword, submitTotal, setPage } = useTalePlay();

  const singleHandler = async (keyword) => {
    try {
      const response = await submitTotal(keyword);

      if (response.data.status === 'SU') {
        setPage();
      }
    } catch {
      return false;
    }
  };

  return (
    <div className="flex flex-col h-full justify-evenly">
      <div className="flex items-center justify-evenly bg-main-beige h-auto w-full p-2 rounded-full">
        <span className="service-accent3">내 단어 : </span>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="border-0 px-2 py-4 rounded-md w-2/3 outline-none service-regular2"
          autoFocus
        />
        <div className="flex items-center p-1">
          <button
            className="bg-main-strawberry rounded-full w-[4rem] h-[4rem] text-text-first"
            onClick={() => {
              singleHandler(inputValue);
            }}>
            <span className="service-bold3">확인</span>
          </button>
        </div>
      </div>

      <KeywordMenu
        back={back}
        next={next}
        reload={reload}
      />
    </div>
  );
}
