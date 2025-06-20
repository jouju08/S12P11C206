import React, { useEffect, useState, useCallback } from 'react';
import { useSightseeing } from '@/store/sightseeingStore';
import { Link } from 'react-router-dom';
import GalleryItem from '@/components/Common/GalleyItem';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';

export default function Sightseeing() {
  const {
    drawingList,
    setDrawingList,
    popList,
    setPopList,
    sortBy,
    setSortBy,
    loadMoreDrawings,
    hasOrigin,
    setHasOrigin,
  } = useSightseeing();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setDrawingList();
    setPopList();
  }, []);

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setDrawingList();
  };

  const handleHasOriginChange = (e) => {
    const newValue = e.target.value === 'true';
    setHasOrigin(newValue);
    setDrawingList();
  };

  const loadMore = useCallback(async () => {
    if (!isLoading) {
      setIsLoading(true);
      const hasMore = await loadMoreDrawings();
      setIsLoading(false);
      if (!hasMore) {
        // 더 이상 불러올 데이터가 없을 때의 처리
      }
    }
  }, [isLoading, loadMoreDrawings]);

  const infiniteScrollRef = useInfiniteScroll(loadMore);

  return (
    <div className="w-[1024px] h-fit px-[25px]">
      <h1 className="text-center text-text-first service-accent1 mx-auto mb-3">
        그림 구경
      </h1>

      {/* 지금 인기 있는 그림 */}
      <div className='w-[974px] h-[585px] mt-[30px] relative bg-[url("/Sightseeing/award-stand.png")] bg-contain bg-center bg-no-repeat'>
        <div className="w-[250px] h-[170px] absolute top-[23px] left-[30px] py-5 flex-col items-center gap-2.5 inline-flex overflow-hidden">
          <div className="text-text-first service-accent2">
            지금 인기 있는 그림!
          </div>
          <div className="text-text-second service-regular3">
            나도 자랑하고 감상해봐요
          </div>
          <Link
            to={'/gallery'}
            className="px-3.5 py-2 bg-main-point2 rounded-[30px] shadow-[4px_4px_4px_0px_rgba(0,0,0,0.15)] justify-center items-center gap-2.5 text-white service-bold3 inline-flex overflow-hidden">
            내 그림 꾸러미 가기
          </Link>
        </div>

        {popList.length > 1 && (
          <>
            {/* 2등 이름 */}
            <div className="w-[145px] h-[89px] absolute bottom-1 left-[248px] px-3 flex-col justify-center items-center gap-px inline-flex overflow-hidden">
              <img
                className="w-[58px] h-[58px] relative rounded-[100px]"
                src={
                  popList[1]?.authorProfileImg
                    ? popList[1].authorProfileImg
                    : '/Main/profile-img.png'
                }
              />
              <div className="text-center text-white service-bold3 w-full whitespace-nowrap overflow-hidden text-ellipsis">
                {popList[1]?.authorNickname}
              </div>
            </div>
            {/* 2등 이미지 */}
            <Link to={`/gallery/${popList[1].galleryId}`}>
              <img
                className="w-[145px] h-[145px] shadow-[4px_4px_4px_0px_rgba(0,0,0,0.25)] absolute origin-top-left top-[267px] left-[253px] bg-white object-cover object-center"
                src={popList[1]?.img || '/Sightseeing/test1.png'}
              />
            </Link>
          </>
        )}

        {popList.length > 0 && (
          <>
            {/* 1등 이름 */}
            <div className="w-[145px] h-[89px] absolute bottom-[15px] left-[410px] px-3 flex-col justify-center items-center gap-px inline-flex overflow-hidden">
              <img
                className="w-[58px] h-[58px] relative rounded-[100px]"
                src={
                  popList[0]?.authorProfileImg
                    ? popList[0].authorProfileImg
                    : '/Main/profile-img.png'
                }
              />
              <div className="text-center text-white service-bold3 w-full whitespace-nowrap overflow-hidden text-ellipsis">
                {popList[0]?.authorNickname}
              </div>
            </div>
            {/* 1등 이미지 */}
            <Link to={`/gallery/${popList[0].galleryId}`}>
              <img
                className="w-[145px] h-[145px] shadow-[4px_4px_4px_0px_rgba(0,0,0,0.25)] absolute origin-top-left top-[206px] left-[414px] bg-white object-cover object-center"
                src={popList[0]?.img || '/Sightseeing/test1.png'}
              />
            </Link>
          </>
        )}

        {popList.length > 2 && (
          <>
            {/* 3등 이름 */}
            <div className="w-[145px] h-[89px] absolute bottom-1 right-[253px] px-3 flex-col justify-center items-center gap-px inline-flex overflow-hidden">
              <img
                className="w-[58px] h-[58px] relative rounded-[100px]"
                src={
                  popList[2]?.authorProfileImg
                    ? popList[2].authorProfileImg
                    : '/Main/profile-img.png'
                }
              />
              <div className="text-center text-white service-bold3 w-full whitespace-nowrap overflow-hidden text-ellipsis">
                {popList[2]?.authorNickname}
              </div>
            </div>
            {/* 3등 이미지 */}
            <Link to={`/gallery/${popList[2].galleryId}`}>
              <img
                className="w-[145px] h-[145px] shadow-[4px_4px_4px_0px_rgba(0,0,0,0.25)] absolute origin-top-left top-[292px] left-[581px] bg-white object-cover object-center"
                src={popList[2]?.img || '/Sightseeing/test1.png'}
              />
            </Link>
          </>
        )}
      </div>

      {/* 작품 갤러리 */}
      <div className="w-[974px] h-fit px-[22px] mb-[30px] mt-[70px]">
        <h1 className="service-accent2 mt-[10px] ">작품 갤러리</h1>
        {/* 정렬 선택 */}
        <div className="flex justify-end items-center gap-4">
          <div className="text-right">
            <select
              value={hasOrigin ? 'true' : 'false'}
              onChange={handleHasOriginChange}
              className="mr-4 border bg-white rounded-md service-regular2 px-4 w-[180px] h-[40px] relative z-50">
              <option value="false">요정그림</option>
              <option value="true">내그림</option>
            </select>
          </div>
          <div className="text-right">
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="mr-4 border bg-white rounded-md service-regular2 px-4 w-[180px] h-[40px] relative z-50">
              <option value="LATEST">최신순</option>
              <option value="POP">인기순</option>
            </select>
          </div>
        </div>

        {/* 그림 목록 */}
        <div>
          {drawingList.length === 0 ? (
            <div className="w-full h-[300px] service-accent1 text-text-first text-center leading-[300px]">
              아직 게시글이 없어요!
            </div>
          ) : (
            <div className="grid grid-flow-row grid-cols-4 gap-4 mt-[30px]">
              {drawingList.map((item, idx) => (
                <GalleryItem
                  item={item}
                  key={idx}
                />
              ))}
            </div>
          )}
        </div>

        {/* Intersection Observer의 타겟 요소 */}
        <div
          ref={infiniteScrollRef}
          style={{ height: '20px' }}></div>
      </div>
    </div>
  );
}
