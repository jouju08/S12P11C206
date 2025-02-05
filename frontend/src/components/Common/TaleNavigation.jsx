import React from 'react';

const TaleNavigation = ({ pageNum, setPageNum }) => {
  return (
    <div className="flex justify-between w-[175px]">
      {/* 이전 화살표 */}
      <div
        onClick={() => pageNum > 0 && setPageNum((prev) => prev - 1)}
        className={`${pageNum <= 0 ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
        <img
          src={'/Common/arrow-left.png'}
          alt="이전 화살표"
          className={`w-[50px] h-[50px] ${pageNum <= 0 ? 'opacity-50 grayscale' : ''}`}
        />
      </div>

      {/* 몇 페이지인지 */}
      <span className="service-accent1 text-right">{pageNum + 1}</span>

      {/* 다음 화살표 */}
      <div
        onClick={() => pageNum < 3 && setPageNum((prev) => prev + 1)}
        className={`${pageNum >= 3 ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
        <img
          src={'/Common/arrow-left.png'}
          alt="다음 화살표"
          className={`w-[50px] h-[50px] -scale-x-100 ${pageNum >= 3 ? 'opacity-50 grayscale' : ''}`}
        />
      </div>
    </div>
  );
};

export default TaleNavigation;
