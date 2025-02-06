import React, { useEffect, useState } from 'react';
import { useCollection } from '@/store/collectionStore';

const dummy = [
  {
    taleId: 1,
    title: 'title1',
    createdAt: '2025-01-03',
    taleTitleImg:
      'https://myfairy-c206.s3.ap-northeast-2.amazonaws.com/tale1.png',
  },
  {
    taleId: 2,
    title: 'title1',
    createdAt: '2025-02-04',
    taleTitleImg:
      'https://myfairy-c206.s3.ap-northeast-2.amazonaws.com/tale1.png',
  },
  {
    taleId: 3,
    title: 'title2',
    createdAt: '2025-02-01',
    taleTitleImg:
      'https://myfairy-c206.s3.ap-northeast-2.amazonaws.com/tale2.png',
  },
  {
    taleId: 4,
    title: 'title3',
    createdAt: '2025-02-02',
    taleTitleImg:
      'https://myfairy-c206.s3.ap-northeast-2.amazonaws.com/tale3.png',
  },
  {
    taleId: 5,
    title: 'title3',
    createdAt: '2025-01-19',
    taleTitleImg:
      'https://myfairy-c206.s3.ap-northeast-2.amazonaws.com/tale3.png',
  },
  {
    taleId: 6,
    title: 'title3',
    createdAt: '2025-02-01',
    taleTitleImg:
      'https://myfairy-c206.s3.ap-northeast-2.amazonaws.com/tale3.png',
  },
];

export default function Collection() {
  const { memberId, myTaleList, setMyTaleList } = useCollection();
  const [sortBy, setSortBy] = useState('전체보기');
  const [filterBy, setFilterBy] = useState('전체보기');

  // 고유한 타이틀 목록 추출
  const uniqueTitles = [...new Set(dummy.map((item) => item.title))];

  useEffect(() => {
    setMyTaleList();
  }, []);

  return (
    <div className="w-[1024px] h-fit px-[25px]">
      <h1 className="text-center text-text-first service-accent1 mx-auto mb-3">
        내 동화 책장
      </h1>

      {/* select */}
      <div className="my-[30px] text-right">
        {/* 정렬 선택 */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="mr-4 border bg-white rounded-md service-regular2 px-4 w-[180px] h-[40px] relative z-50">
          <option value="전체보기">전체 보기</option>
          <option value="최신순">최신순</option>
          <option value="과거순">과거순</option>
        </select>

        {/* 제목 필터 */}
        <select
          value={filterBy}
          onChange={(e) => setFilterBy(e.target.value)}
          className="border bg-white rounded-md service-regular2 px-4 w-[180px] h-[40px] relative z-50">
          <option value="전체보기">전체 보기</option>
          {uniqueTitles.map((title) => (
            <option
              key={title}
              value={title}>
              {title}
            </option>
          ))}
        </select>
      </div>

      {/* 내가 만든 동화 렌더링 */}
      <section
        id="need-scrool"
        className="w-[974px] h-[486px] relative overflow-y-auto mt-[65px] scr pr-4">
        <TaleGrid
          myTaleList={dummy}
          filterBy={filterBy}
          sortBy={sortBy}
        />
      </section>
    </div>
  );
}

const TaleGrid = ({ myTaleList, filterBy, sortBy }) => {
  const handleClick = () => {};

  const filteredTaleList = myTaleList
    .filter((item) =>
      filterBy === '전체보기' ? true : item.title === filterBy
    )
    .sort((a, b) => {
      if (sortBy === '최신순')
        return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === '과거순')
        return new Date(a.createdAt) - new Date(b.createdAt);
      return 0;
    });

  return (
    <div className="container mx-auto">
      {chunk(filteredTaleList, 5).map((row, rowIndex) => (
        // row
        <div
          key={rowIndex}
          className="relative mb-8">
          <div className="grid grid-cols-5 gap-4">
            {row.map((item, index) => (
              // row에 item 하나
              <div
                key={index}
                className="group relative bg-local bg-no-repeat bg-right-top cursor-pointer"
                style={{
                  backgroundImage: "url('/Collection/book-cover.png')",
                }}>
                {/* 여기에 item의 내용을 렌더링 */}
                <div className="absolute z-10 pt-[90%] text-center inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
                  {/* 보러가기 버튼 누르면 동화책 모달 띄울까? */}
                  <button className="bg-main-btn w-[85px] h-[24px] text-center service-regular3 px-3 rounded-xl">
                    보러가기
                  </button>

                  {/* 확인용 */}
                  <p>{item.createdAt}</p>
                </div>
                <img
                  className="w-[149px] h-[195px] mx-auto my-4 rounded opacity-90 relative"
                  src={item.taleTitleImg}
                  alt="동화 표지"
                />
              </div>
            ))}
          </div>
          <div className="absolute bottom-1 left-0">
            <img
              src="/Collection/bookshelf.png"
              alt="Bar"
              className="w-[977px] h-[10px]"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

// 배열을 지정된 크기의 청크로 나누는 헬퍼 함수
const chunk = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  );
