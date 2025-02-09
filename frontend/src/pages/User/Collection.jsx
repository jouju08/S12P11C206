import React, { useEffect, useState, useRef } from 'react';
import { useCollection } from '@/store/collectionStore';
import TaleNavigation from '@/components/Common/TaleNavigation';
import { space } from 'postcss/lib/list';
import AudioPlayer from '@/components/Common/AudioPlayer';

// const dummy = [
//   {
//     taleId: 6,
//     baseTaleId: 1,
//     title: 'title1',
//     createdAt: '2025-01-03',
//     img: 'https://myfairy-c206.s3.ap-northeast-2.amazonaws.com/tale1.png',
//   },
//   {
//     taleId: 7,
//     baseTaleId: 1,
//     title: 'title1',
//     createdAt: '2025-02-04',
//     img: 'https://myfairy-c206.s3.ap-northeast-2.amazonaws.com/tale1.png',
//   },
//   {
//     taleId: 8,
//     baseTaleId: 1,
//     title: 'title2',
//     createdAt: '2025-02-01',
//     img: 'https://myfairy-c206.s3.ap-northeast-2.amazonaws.com/tale2.png',
//   },
//   {
//     taleId: 9,
//     baseTaleId: 1,
//     title: 'title3',
//     createdAt: '2025-02-02',
//     img: 'https://myfairy-c206.s3.ap-northeast-2.amazonaws.com/tale3.png',
//   },
//   {
//     taleId: 10,
//     baseTaleId: 1,
//     title: 'title3',
//     createdAt: '2025-01-19',
//     img: 'https://myfairy-c206.s3.ap-northeast-2.amazonaws.com/tale3.png',
//   },
//   {
//     taleId: 11,
//     baseTaleId: 1,
//     title: 'title3',
//     createdAt: '2025-02-01',
//     img: 'https://myfairy-c206.s3.ap-northeast-2.amazonaws.com/tale3.png',
//   },
// ];

export default function Collection() {
  const { memberId, myTaleList, setMyTaleList } = useCollection();
  const [sortBy, setSortBy] = useState('전체보기');
  const [filterBy, setFilterBy] = useState('전체보기');
  const [showModal, setShowModal] = useState(false);

  // 고유한 타이틀 목록 추출
  const uniqueTitles = [...new Set(myTaleList.map((item) => item.title))];

  const handleExit = () => {
    setShowModal(false);
  };

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
          myTaleList={myTaleList}
          filterBy={filterBy}
          sortBy={sortBy}
          setShowModal={setShowModal}
        />
      </section>

      {/* 동화 모달 */}
      {showModal && (
        <div className="absolute top-0 left-0 z-50 w-full h-full bg-[rgba(0,0,0,0.5)] flex justify-center items-center">
          <Modal
            handleExit={handleExit}
            showModal={showModal}
          />
        </div>
      )}
    </div>
  );
}

const TaleGrid = ({ myTaleList, filterBy, sortBy, setShowModal }) => {
  const { taleStart, setTaleStart, setSeeTaleId } = useCollection();

  // 보러가기 버튼을 누르면 모달을 띄워줌
  const handleClick = (baseTaleId, taleId) => {
    setShowModal(true); // 모달 보여주기
    // 동화 초입부 불러오기
    setTaleStart(baseTaleId);
    // 내가 무슨 동화(몇번째 만들어진 동화) 보고 있는지 넘기기
    setSeeTaleId(taleId);
  };

  const filteredTaleList = myTaleList
    .filter((item) =>
      filterBy === '전체보기' ? true : item.title === filterBy
    )
    .sort((a, b) => {
      if (sortBy === '최신순')
        return (
          new Date(b.createdAt.slice(0, 10)) -
          new Date(a.createdAt.slice(0, 10))
        );
      if (sortBy === '과거순')
        return (
          new Date(a.createdAt.slice(0, 10)) -
          new Date(b.createdAt.slice(0, 10))
        );
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
                  <button
                    onClick={() => handleClick(item.baseTaleId, item.taleId)}
                    className="bg-main-btn w-[85px] h-[24px] text-center service-regular3 px-3 rounded-xl">
                    보러가기
                  </button>

                  {/* 확인용 - 나중에 지우기!!!*/}
                  <p className="text-white">{item.createdAt.slice(0, 10)}</p>
                </div>
                <img
                  className="w-[149px] h-[195px] mx-auto my-4 rounded opacity-90 relative"
                  src={item.img}
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

// 동화 상세보기 모달
const Modal = ({ handleExit, showModal }) => {
  const [pageNum, setPageNum] = useState(0);
  const [isOrigin, setIsOrigin] = useState(false); // 오리지널 그림인가? : 아니요
  const { setTaleDetail, taleStart, taleDetail } = useCollection();

  // pageNum 바뀔 때마다 렌더링
  useEffect(() => {
    setTaleDetail(pageNum);
    setIsOrigin(false);
  }, [pageNum]);

  const renderPageContent = (pageNum) => {
    if (pageNum === 0) {
      return <span>{taleStart['startScript']}</span>;
    } else if (pageNum === 5) {
      return (
        <>
          <p>동화제목 : {taleStart['title']}</p>
          <p>글쓴이 : 누구일까요</p>
          <p>완성날짜 : 언제일까요</p>
        </>
      );
    } else {
      return <span>{taleDetail['script']}</span>;
    }
  };

  return (
    <div className="w-[1024px] h-[768px] bg-white rounded-[20px] shadow-[4px_4px_4px_0px_rgba(0,0,0,0.25)] border border-gray-200 flex-col justify-center items-start inline-flex overflow-hidden">
      {/* title */}
      <div className="w-[1024px] h-[100px] px-[60px] relative overflow-hidden bg-main-background flex justify-between items-center shadow-lg z-10">
        <div className="w-[141px] h-[72px]">
          <img
            className="w-[141px] inline-block"
            src="Common/logo-blue.png"
          />
        </div>
        <div className="text-text-first absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 service-accent1">
          {taleStart['title']}
        </div>
        <button
          onClick={handleExit}
          className="w-16 h-16 relative bg-main-choose rounded-full flex justify-center items-center">
          <img
            src="/Common/close.png"
            alt="닫기"
          />
        </button>
      </div>
      {/* 내용 */}
      <div
        className="w-[1024px] h-[668px] relative"
        style={{ backgroundImage: "url('TaleStart/field-background.png')" }}>
        {/* 배경 - 책 이미지 */}
        <img
          className="w-[1024px] h-[555px] absolute bottom-[18px] left-0"
          src="/Collection/modal-open-book.png"
        />
        {/* 음향 - 데이터 받아오면 바꾸기*/}
        {pageNum === 5 ? null : pageNum === 0 ? (
          // base-tale 시작 음향
          <div className="text-right pr-20 mt-2">
            <AudioPlayer
              pageNum={pageNum}
              audioSrc={taleStart['startVoice']}
            />
          </div>
        ) : (
          // 그외 페이지 시작 음향
          <div className="text-right pr-20 mt-2">
            {/* <AudioPlayer audioSrc={taleDetail['voice']} /> */}
            <AudioPlayer
              pageNum={pageNum}
              audioSrc="/Collection/test-audio.wav"
            />
          </div>
        )}

        {/* 요정 버튼 */}
        {pageNum === 5 ? null : (
          <button
            onClick={() => {
              setIsOrigin(!isOrigin);
            }}
            className="w-[200px] h-[100px] absolute top-[115px] left-[90px] flex items-center cursor-pointer">
            <img
              src="/Collection/fairy-magic.png"
              className="w-[100px] transition-transform duration-200 hover:scale-105"
              alt="그림 바꾸기"
            />
            {isOrigin ? (
              <span className="text-text-second service-regular3">
                AI 그림 보기
              </span>
            ) : (
              <span className="text-text-second service-regular3">
                원래 그림 보기
              </span>
            )}
          </button>
        )}

        {/* 이미지와 스크립트는 absolute */}
        {/* 이미지 데이터 받아오면 바꾸기 */}
        <img
          className="w-[340px] h-[340px] blur-[20px] absolute z-10 left-[148px] top-[195px]"
          src="/TaleStart/test-story-start.jpg"
        />
        <img
          src="/TaleStart/test-story-start.jpg"
          alt="동화 만든 이미지"
          className="w-[300px] h-[300px] z-10 absolute left-[168px] top-[215px]"
        />

        <div className="w-[378px] h-[430px] z-10 absolute right-[105px] top-[140px] flex flex-col justify-center items-center text-text-first story-basic2">
          <p className="text-text-first story-basic2">
            {/* 옛날 옛적에 아기돼지 삼형제가 살고 있었습니다.
            <br />
            이들은 각자 자신만의 집을 짓기로 결정했어요.
            <br />
            늑대는 첫째 돼지의 집에 와서 말했어요.
            <br />
            "문을 열어라!" */}
          </p>
          {renderPageContent(pageNum)}
        </div>
        <div className="absolute bottom-3 left-1/2  transform -translate-x-1/2 -translate-y-1/2">
          <TaleNavigation
            maxNum={5}
            pageNum={pageNum}
            setPageNum={setPageNum}
          />
        </div>
      </div>
    </div>
  );
};
