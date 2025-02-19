import React, { useEffect, useState, useCallback } from 'react';
import { useCollection } from '@/store/collectionStore';
import CollectionModal from '@/components/modal/CollectionModal';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';

const chunk = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  );

const TaleGrid = ({ myTaleList, filterBy, sortBy, setShowModal }) => {
  const { taleStart, setTaleStart, setSeeTaleId } = useCollection();

  if (myTaleList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full -mt-20">
        <img
          src="/Common/nodata.png"
          alt="No Data"
          className="w-[100px] h-[100px]"
        />
        <p className="service-accent2 mt-2">아직 만들어진 동화가 없어요</p>
      </div>
    );
  }

  const getTextClass = (text) => {
    return text.length > 8 ? 'service-regular3' : 'service-regular2';
  };

  return (
    <div className="container mx-auto">
      {chunk(myTaleList, 5).map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="relative mb-8">
          <div className="grid grid-cols-5 gap-4">
            {row.map((item, index) => (
              <div
                key={index}
                className="group relative bg-local bg-no-repeat bg-right-top cursor-pointer"
                style={{
                  backgroundImage: "url('/Collection/book-cover.png')",
                }}>
                <div
                  onClick={() => {
                    setShowModal(true);
                    setTaleStart(item.baseTaleId);
                    setSeeTaleId(item.taleId);
                  }}
                  className="absolute cursor-pointer z-10 text-center flex flex-col justify-start items-center inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out ">
                  <p
                    className={`bg-[rgba(256,256,256,0.7)] rounded-lg mt-7 w-[70%] text-text-first ${getTextClass(item.title)}`}>
                    {item.title}
                  </p>
                  <p className="bg-[rgba(256,256,256,0.7)] my-1 rounded-lg px-1 w-fit text-text-first">
                    {item.createdAt.slice(0, 10)}
                  </p>
                  <img
                    src="/Collection/go-read.gif"
                    alt="보러가기"
                    className="w-20 h-20 absolute -bottom-1 -right-2"
                  />
                  <img
                    src="/Common/fairy-chat-bubble.png"
                    alt="보러가기"
                    className="absolute bottom-7 left-10 w-[45%] h-[30px] scale-x-[-1]"
                  />
                  <p className="absolute bottom-[30px] left-12 service-regular3 text-text-second">
                    보러가기
                  </p>
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

export default function Collection() {
  const {
    memberId,
    myTaleList,
    setMyTaleList,
    tailTitleList,
    setTailTitleList,
    sortBy,
    setSortBy,
    filterBy,
    setFilterBy,
    loadMoreTales,
  } = useCollection();

  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const loadMore = useCallback(async () => {
    if (!isLoading) {
      setIsLoading(true);
      const hasMore = await loadMoreTales();
      setIsLoading(false);
      if (!hasMore) {
        // 더 이상 불러올 데이터가 없을 때의 처리
      }
    }
  }, [loadMoreTales]);

  const infiniteScrollRef = useInfiniteScroll(loadMore);

  const handleExit = () => {
    setShowModal(false);
  };

  useEffect(() => {
    setMyTaleList();
    setTailTitleList();
  }, [setMyTaleList]);

  return (
    <div className="w-[1024px] max-h-screen px-[25px]">
      <h1 className="text-center text-text-first service-accent1 mx-auto mb-3">
        내 동화 책장
      </h1>

      <div className="my-[30px] text-right">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="mr-4 border bg-white rounded-md service-regular2 px-4 w-[180px] h-[40px] relative z-50">
          <option value="LATEST">최신순</option>
          <option value="PAST">과거순</option>
        </select>

        <select
          value={filterBy}
          onChange={(e) => setFilterBy(e.target.value)}
          className="border bg-white rounded-md service-regular2 px-4 w-[180px] h-[40px] relative z-50">
          <option value={null}>전체 보기</option>
          {tailTitleList.map((item) => (
            <option
              key={item.baseTaleId}
              value={item.baseTaleId}>
              {item.title}
            </option>
          ))}
        </select>
      </div>

      <section
        id="need-scrool"
        className="w-[974px] h-[486px] relative overflow-y-auto mt-[65px] scr pr-4">
        {myTaleList.length === 0 ? (
          <div className="w-full h-[300px] service-accent1 text-text-first text-center leading-[300px]">
            아직 동화책이 없어요!
          </div>
        ) : (
          <TaleGrid
            myTaleList={myTaleList}
            filterBy={filterBy}
            sortBy={sortBy}
            setShowModal={setShowModal}
          />
        )}
        {/* Intersection Observer의 타겟 요소 */}
        <div
          ref={infiniteScrollRef}
          style={{ height: '20px' }}></div>
      </section>

      {showModal && (
        <div className="absolute top-[-100px] left-0 z-50 w-full h-dvh bg-[rgba(0,0,0,0.5)] flex justify-center items-center">
          <CollectionModal handleExit={handleExit} />
        </div>
      )}
    </div>
  );
}
