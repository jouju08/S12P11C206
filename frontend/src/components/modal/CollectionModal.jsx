import React, { useState, useEffect } from 'react';
import AudioPlayer from '@/components/Common/AudioPlayer';
import TaleNavigation from '@/components/Common/TaleNavigation';
import { useCollection } from '@/store/collectionStore';

const CollectionModal = ({ handleExit }) => {
  const [pageNum, setPageNum] = useState(0);
  const [isOrigin, setIsOrigin] = useState(false);
  const {
    setTaleDetail,
    taleStart,
    taleDetail,
    setTaleFinish,
    participants,
    createdAt,
  } = useCollection();

  useEffect(() => {
    setTaleDetail(pageNum);
    setIsOrigin(false);
  }, [pageNum, setTaleDetail]);

  useEffect(() => {
    setTaleFinish();
  }, []);

  const renderPageContent = (pageNum) => {
    if (pageNum === 5) {
      return (
        <div className="flex flex-col gap-5">
          <p className="relative after:content[''] after:h-[20px] after:w-[85px] after:-z-10 after:absolute after:bottom-0 after:left-0 after:bg-main-strawberry">
            동화제목 : {taleStart['title']}
          </p>
          <div className="flex items-start gap-5">
            <p
              className="
            relative after:content[''] after:h-[20px] after:w-[65px] after:-z-10 after:absolute after:bottom-0 after:left-0 after:bg-main-strawberry">
              글쓴이 :
            </p>
            <ul className="pl">
              {participants.map((item, idx) => (
                <li key={{ idx }}>{item}</li>
              ))}
            </ul>
          </div>
          <p
            className="
            relative after:content[''] after:h-[20px] after:w-[90px] after:-z-10 after:absolute after:bottom-0 after:left-0 after:bg-main-strawberry">
            완성날짜 : {createdAt.slice(0, 4)}년 {Number(createdAt.slice(5, 7))}
            월 {Number(createdAt.slice(8, 10))}일
          </p>
        </div>
      );
    } else {
      return <span>{taleDetail['script']}</span>;
    }
  };

  return (
    <div className="w-[1024px] h-fit bg-white rounded-[20px] shadow-[4px_4px_4px_0px_rgba(0,0,0,0.25)] border border-gray-200 flex-col justify-center items-start inline-flex overflow-hidden">
      <div className="w-[1024px] h-[100px] px-[60px] relative overflow-hidden bg-main-background flex justify-between items-center shadow-lg z-10">
        <div className="w-[141px] h-[72px]">
          <img
            className="w-[141px] inline-block"
            src="Common/logo-blue.png"
            alt="Logo"
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

      <div
        className="relative w-[1024px] h-[580px] tall:h-[668px]"
        style={{ backgroundImage: "url('TaleStart/field-background.png')" }}>
        <img
          className="w-[1024px] h-[555px] absolute bottom-[18px] left-0"
          src="/Collection/modal-open-book.png"
          alt="책 이미지"
        />

        {pageNum === 5 ? null : (
          <div className="text-right pr-20 mt-2">
            <AudioPlayer
              pageNum={pageNum}
              audioSrc={taleDetail['voice']}
            />
          </div>
        )}

        {pageNum === 5 || pageNum === 0 ? null : (
          <button
            onClick={() => setIsOrigin(!isOrigin)}
            className="w-[200px] h-[100px] absolute bottom-[425px] left-[90px] z-50 flex items-center cursor-pointer">
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

        {pageNum === 0 ? (
          <div>
            <img
              src={taleStart['startImg']}
              alt="블러 처리 이미지"
              className="w-[340px] h-[340px] blur-[20px] absolute z-10 left-[148px] bottom-[133px]"
            />
            <img
              src={taleStart['startImg']}
              alt="동화 만든 이미지"
              className="w-[300px] h-[300px] z-10 absolute left-[168px] bottom-[153px]"
            />
          </div>
        ) : pageNum === 5 ? (
          <div>
            <img
              src={taleStart['startImg']}
              alt="블러 처리 이미지"
              className="w-[340px] h-[340px] blur-[20px] absolute z-10 left-[148px] bottom-[133px]"
            />
            <img
              src={taleStart['startImg']}
              alt="동화 만든 이미지"
              className="w-[300px] h-[300px] z-10 absolute left-[168px] bottom-[153px]"
            />
          </div>
        ) : (
          <div>
            <img
              src={isOrigin ? taleDetail['originImg'] : taleDetail['img']}
              alt="블러 처리 이미지"
              className="w-[340px] h-[340px] blur-[20px] absolute z-10 left-[148px] bottom-[133px]"
            />
            <img
              src={isOrigin ? taleDetail['originImg'] : taleDetail['img']}
              alt="동화 만든 이미지"
              className="w-[300px] h-[300px] z-10 absolute left-[168px] bottom-[153px]"
            />
          </div>
        )}

        <div className="w-[378px] h-[430px] z-10 absolute right-[105px] bottom-[95px] flex flex-col justify-center items-center text-text-first story-basic2">
          <p className="text-text-first story-basic2"></p>
          {renderPageContent(pageNum)}
        </div>

        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
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

export default CollectionModal;
