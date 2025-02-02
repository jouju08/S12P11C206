import React, { useState } from 'react';
import KeywordInput from './Keyword/KeywordInput';
import KeywordTyping from './Keyword/KeywordTyping';
import KeywordVoice from './Keyword/KeywordVoice';
import KeywordHandWrite from './Keyword/KeywordHandWrite';

export default function Keyword() {
  const inputTypes = ['typing', 'voice', 'handwrite'];
  const [activeInput, setActiveInput] = useState(null);

  //싱글모드
  //다음 문장으로 넘어감
  // const next = () => {};

  //싱글모드
  //타이핑, 녹음, 그리기 초기화
  const reload = () => {};

  return (
    <div className="h-full transition-all duration-500 ease-in-out">
      {/* 입력 타입 버튼 (초기 상태) */}
      <div
        className={`flex flex-row gap-3 transition-all duration-500 ease-in-out overflow-hidden ${
          activeInput ? 'opacity-0 h-0 pointer-events-none' : 'opacity-100'
        }`}>
        {inputTypes.map((type) => (
          <KeywordInput
            key={type}
            type={type}
            isActive={activeInput === type}
            onclickEvent={() => setActiveInput(type)}
          />
        ))}
      </div>

      {/* 선택된 입력 방식 */}
      <div
        className={`h-full px-10 transition-all duration-500 ease-in-out overflow-hidden ${
          activeInput ? 'opacity-100' : 'opacity-0 h-0 pointer-events-none'
        }`}>
        {activeInput === 'typing' && (
          <KeywordTyping back={() => setActiveInput(null)} />
        )}
        {activeInput === 'voice' && (
          <KeywordVoice back={() => setActiveInput(null)} />
        )}
        {activeInput === 'handwrite' && (
          <KeywordHandWrite back={() => setActiveInput(null)} />
        )}
      </div>
    </div>
  );
}
