import React, { useEffect, useState, useRef } from "react";
import ImageModal from "@/components/modal/ImageModal";
import { useMyPictures } from "@/store/galleryStore";

export default function Exhibition() {
  const {
    myPictures,
    hasMore,
    pictureDetail,
    pictureTitles,
    fetchMyPictures,
    fetchPictureDetail,
    fetchPictureTitles,
  } = useMyPictures();

  const [sortBy, setSortBy] = useState("전체보기");
  const [filterBy, setFilterBy] = useState("전체보기");

  const [page, setPage] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const scrollRef = useRef(null);

  useEffect(() => {
    setPage(0);
    fetchMyPictures(0, 24, sortBy, filterBy);
  }, [sortBy, filterBy, fetchMyPictures]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    if (scrollTop + clientHeight >= scrollHeight - 10 && hasMore) {
      const nextPage = page + 1;
      fetchMyPictures(nextPage, 24, sortBy, filterBy);
      setPage(nextPage);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [page, hasMore, sortBy, filterBy]);

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterBy(e.target.value);
  };

  const handleFilterFocus = () => {
    fetchPictureTitles();
  };

  const handleOpenModal = (picture) => {
    fetchPictureDetail({ taleMemberId: picture.id });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="min-h-screen p-4">
      <div className="bg-white p-6 shadow-md w-[635px] h-[568px] flex flex-col relative">
        <div className="flex justify-end items-center space-x-[8px] mb-4">
          <select
            value={sortBy}
            onChange={handleSortChange}
            className="service-regular3 border border-gray-300 rounded-md px-4 py-2 text-gray-700 w-[180px] h-[40px]"
          >
            <option value="전체보기">전체 보기</option>
            <option value="최신순">최신순</option>
            <option value="과거순">과거순</option>
          </select>
          <select
            value={filterBy}
            onChange={handleFilterChange}
            onFocus={handleFilterFocus}
            className="service-regular3 border border-gray-300 rounded-md px-4 py-2 text-gray-700 w-[180px] h-[40px]"
            style={{ maxHeight: "200px", overflowY: "auto" }}
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
        
        <div
          id="need-scrool"
          ref={scrollRef}
          className={`flex-1 overflow-y-auto ${
            myPictures.length === 0 ? "flex items-center justify-center" : ""
          }`}
        >
          {myPictures.length > 0 ? (
            <div className="grid grid-cols-4 gap-4">
              {myPictures.map((picture) => (
                <div
                  key={picture.id}
                  className="flex items-center cursor-pointer"
                  onClick={() =>
                    picture.orginImg ? handleOpenModal(picture) : undefined
                  }
                >
                  {picture.orginImg ? (
                    <img
                      src={picture.orginImg}
                      alt={`Image ${picture.id}`}
                      className="w-[120px] h-[120px] object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-[120px] h-[120px] bg-gray-300 flex flex-col items-center justify-center">
                      <img
                        src="/Gallery/camera.png"
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
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <img
                src="/Common/nodata.png"
                alt="No Data"
                className="w-[80px] h-[80px]"
              />
              <p className="service-accent2 mt-2">
                아직 만들어진 그림이 없어요
              </p>
            </div>
          )}
        </div>
        {/* 모달 오버레이 */}
        {showModal && (
          <div className="absolute top-0 left-0 z-50 w-full h-full">
            <ImageModal
              isOpen={showModal}
              onClose={handleCloseModal}
              detail={pictureDetail}
            />
          </div>
        )}
      </div>
    </div>
  );
}
