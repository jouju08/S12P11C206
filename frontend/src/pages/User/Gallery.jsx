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
  const [sortBy, setSortBy] = useState('전체보기'); 
  const [filterBy, setFilterBy] = useState('전체보기');
  const [showModal, setShowModal] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    setPage(0);
    fetchMyPictures(0, 12, sortBy, filterBy);
  }, [sortBy, filterBy, fetchMyPictures]);

  const handleFilterFocus = () => {
    fetchPictureTitles();
  };

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

  // 이미지 값이 존재하는 항목만 필터링합니다.
  const displayedList = myPictures.filter(item => item.orginImg);

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
        {displayedList.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <img
              src="/Common/nodata.png"
              alt="No Data"
              className="w-[100px] h-[100px]"
            />
            <p className="service-accent2 mt-2">아직 만들어진 그림이 없어요</p>
          </div>
        ) : (
          <div className="flex flex-wrap">
            {displayedList.map((item, index) => {
              const isLineNeeded = index % 4 === 0;
              return (
                <React.Fragment key={item.id}>
                  {isLineNeeded && (
                    <div className="w-full mb-2 relative h-[40px]">
                      <img
                        src="/Gallery/picture-display.png"
                        alt="빨래집게 라인"
                        className="absolute top-0 left-0 w-full h-auto z-10"
                      />
                    </div>
                  )}
                  <div
                    className="relative z-0 w-[215px] h-[215px] bg-white flex items-center justify-center m-2 cursor-pointer mt-5"
                    onClick={() => handleOpen(item)}
                  >
                    <img
                      src={item.orginImg}
                      alt={`Image ${item.id}`}
                      className="w-[195px] h-[195px] object-cover bg-gray-300"
                    />
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        )}
      </section>

      {showModal && (
        <div className="absolute top-0 left-0 z-50 w-full h-full flex justify-center items-center">
          <ImageModal isOpen={showModal} onClose={handleExit} detail={pictureDetail} />
        </div>
      )}
    </div>
  );
}
