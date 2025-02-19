import React, { useEffect, useState } from 'react';
import { useCollection } from '@/store/collectionStore';
import CollectionModal from '@/components/modal/CollectionModal';

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
                <div className="absolute z-10 pt-[90%] text-center inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
                  <button
                    onClick={() => {
                      setShowModal(true);
                      setTaleStart(item.baseTaleId);
                      setSeeTaleId(item.taleId);
                    }}
                    className="bg-main-btn w-[85px] h-[24px] text-center service-regular3 px-3 rounded-xl">
                    보러가기
                  </button>
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
  } = useCollection();

  const [showModal, setShowModal] = useState(false);



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
        <TaleGrid
          myTaleList={myTaleList}
          filterBy={filterBy}
          sortBy={sortBy}
          setShowModal={setShowModal}
        />
      </section>

      {showModal && (
        <div className="absolute top-[-100px] left-0 z-50 w-full h-dvh bg-[rgba(0,0,0,0.5)] flex justify-center items-center">
          <CollectionModal handleExit={handleExit} />
        </div>
      )}
    </div>
  );
}
