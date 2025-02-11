import React, { useEffect, useState, useRef } from 'react';
import ImageModal from '@/components/modal/ImageModal';
import { useMyPictures } from '@/store/galleryStore';

export default function Gallery() {
  const {
    fetchMyPictures,
    fetchPictureTitles,
    fetchPictureDetail,
    myPictures,
    pictureDetail,
    pictureTitles,
    hasMore,
  } = useMyPictures();

  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState('전체보기'); // "전체보기", "최신순", "과거순"
  const [filterBy, setFilterBy] = useState('전체보기');
  const [showModal, setShowModal] = useState(false);
  const scrollRef = useRef(null);

  // 초기 로드: 페이지 0, 12개, 현재 sortBy, filterBy 기준
  useEffect(() => {
    setPage(0);
    fetchMyPictures(0, 12, sortBy, filterBy);
  }, [sortBy, filterBy, fetchMyPictures]);

  // 필터(dropdown)에 포커스하면 동화 제목 목록 API 호출
  const handleFilterFocus = () => {
    fetchPictureTitles();
  };

  // 무한 스크롤: 스크롤 끝에 도달 시 다음 페이지 데이터 요청
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 10 && hasMore) {
      const nextPage = page + 1;
      fetchMyPictures(nextPage, 12, sortBy, filterBy);
      setPage(nextPage);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, [page, hasMore, sortBy, filterBy]);

  // placeholder: 한 행 4개를 채우기 위한 빈 아이템 추가
  const realCount = myPictures.length;
  const remainder = realCount % 4;
  const placeholdersNeeded = remainder === 0 ? 0 : 4 - remainder;
  const displayedList = [...myPictures];
  if (placeholdersNeeded > 0) {
    const placeholders = Array.from({ length: placeholdersNeeded }, (_, i) => ({
      id: `placeholder_${i}`,
      orginImg: '',
    }));
    displayedList.push(...placeholders);
  }

  // 이미지 클릭 시 상세 정보 요청 (taleMemberId만 전달; memberId는 Security에서 처리)
  const handleOpen = (item) => {
    const requestPayload = {
      taleMemberId: item.id,
    };
    fetchPictureDetail(requestPayload);
    setShowModal(true);
  };

  const handleExit = () => setShowModal(false);

  return (
    <div className="w-[1024px] h-fit px-[25px] relative">
      <h1 className="text-center text-text-first service-accent1 mx-auto mb-3">
        내 그림 꾸러미
      </h1>

      <div className="my-[30px] text-right">
        {/* 정렬 dropdown: 선택 시 현재 filter 값과 함께 API 요청 */}
        <select
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value);
            setPage(0);
            fetchMyPictures(0, 12, e.target.value, filterBy);
          }}
          className="mr-4 border bg-white rounded-md service-regular2 px-4 w-[180px] h-[40px]"
        >
          <option value="전체보기">전체 보기</option>
          <option value="최신순">최신순</option>
          <option value="과거순">과거순</option>
        </select>

        {/* 필터 dropdown: 선택 시 현재 sort 값과 함께 API 요청; onFocus로 제목 목록 호출 */}
        <select
          value={filterBy}
          onChange={(e) => {
            setFilterBy(e.target.value);
            setPage(0);
            fetchMyPictures(0, 12, sortBy, e.target.value);
          }}
          onFocus={handleFilterFocus}
          className="border bg-white rounded-md service-regular2 px-4 w-[180px] h-[40px]"
          style={{ maxHeight: '200px', overflowY: 'auto' }}
        >
          <option value="전체보기">전체 보기</option>
          {pictureTitles &&
            pictureTitles.map((title, index) => (
              <option key={index} value={title}>
                {title}
              </option>
            ))}
        </select>
      </div>

      <section
        id="need-scrool"
        ref={scrollRef}
        className="w-[950px] h-[486px] relative overflow-y-auto mt-[30px] pr-4"
      >
        <div className="flex flex-wrap">
          {displayedList.map((item, index) => {
            const isLineNeeded = index % 4 === 0;
            return (
              <React.Fragment key={item.id}>
                {isLineNeeded && (
                  <div className="w-full mb-2 relative h-[40px]">
                    <img
                      src="/public/gallery/picture-display.png"
                      alt="빨래집게 라인"
                      className="absolute top-0 left-0 w-full h-auto z-10"
                    />
                  </div>
                )}
                <div
                  className="relative z-0 w-[215px] h-[215px] bg-white flex items-center justify-center m-2 cursor-pointer mt-5"
                  onClick={item.orginImg ? () => handleOpen(item) : undefined}
                >
                  {item.orginImg ? (
                    <img
                      src={item.orginImg}
                      alt={`Image ${item.id}`}
                      className="w-[195px] h-[195px] object-cover bg-gray-300"
                    />
                  ) : (
                    <div className="w-[195px] h-[195px] bg-gray-300 flex flex-col items-center justify-center">
                      <img
                        src="/public/gallery/camera.png"
                        alt="카메라"
                        className="w-[80px] h-[80px]"
                      />
                      <p className="story-basic2 mt-2 text-center">
                        다음 사진
                        <br />
                        나오는 중...
                      </p>
                    </div>
                  )}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </section>

      {showModal && (
        <div className="absolute top-0 left-0 z-50 w-full h-full bg-[rgba(0,0,0,0.5)] flex justify-center items-center">
          <ImageModal isOpen={showModal} onClose={handleExit} detail={pictureDetail} />
        </div>
      )}
    </div>
  );
}
