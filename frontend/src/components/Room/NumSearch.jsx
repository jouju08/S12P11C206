import React from 'react';
import { useState } from 'react';
// import { Search } from 'lucide-react'; // Lucide 아이콘 사용

export default function NumSearch({ onSearch }) {
  const [query, setQuery] = useState('');

  // 검색 실행 함수
  const handleSearch = () => {
    if (query.trim() !== '') {
      console.log('검색 실행:', query);
      // 검색 실행 로직 추가 (API 호출) 아니면 받은 query 보내서 부모에서 로직 실행
      onSearch(query); // 부모 컴포넌트에 검색어 전달
    }
  };

  // 엔터키 입력 시 검색 실행
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="relative w-[239px]">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyPress} // 엔터키 이벤트 추가
        placeholder="방 번호 입력해서 시작하기"
        className="w-full h-12 px-4 pr-12 py-3 bg-white rounded-full border border-gray-200 service-regular3"
      />
      {/* 돋보기 아이콘 (클릭 시 검색 실행) */}
      <button
        onClick={handleSearch}
        className="absolute inset-y-0 right-4 flex items-center justify-center">
        <img
          src="/Room/search.png"
          alt="검색"
          className="w-5 h-5"
        />
      </button>
    </div>
  );
}
