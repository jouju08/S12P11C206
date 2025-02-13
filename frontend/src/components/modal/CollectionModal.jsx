import React, { useState, useEffect } from 'react';
import AudioPlayer from '@/components/Common/AudioPlayer';
import TaleNavigation from '@/components/Common/TaleNavigation';
import { useCollection } from '@/store/collectionStore';

const CollectionModal = ({ handleExit }) => {
  const [pageNum, setPageNum] = useState(0);
  const [isOrigin, setIsOrigin] = useState(false); 
  const { setTaleDetail, taleStart, taleDetail } = useCollection();

  useEffect(() => {
    setTaleDetail(pageNum);
    setIsOrigin(false);
  }, [pageNum, setTaleDetail]);

  const renderPageContent = (pageNum) => {
    if (pageNum === 4) {
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
      <div className="w-[1024px] h-[100px] px-[60px] relative overflow-hidden bg-main-background flex justify-between items-center shadow-lg z-10">
        <div className="w-[141px] h-[72px]">
          <img className="w-[141px] inline-block" src="Common/logo-blue.png" alt="Logo" />
        </div>
        <div className="text-text-first absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 service-accent1">
          {taleStart['title']}
        </div>
        <button
          onClick={handleExit}
          className="w-16 h-16 relative bg-main-choose rounded-full flex justify-center items-center"
        >
          <img src="/Common/close.png" alt="닫기" />
        </button>
      </div>
      
      <div
        className="w-[1024px] h-[668px] relative"
        style={{ backgroundImage: "url('TaleStart/field-background.png')" }}
      >
      
        <img
          className="w-[1024px] h-[555px] absolute bottom-[18px] left-0"
          src="/Collection/modal-open-book.png"
          alt="책 이미지"
        />
        
        {pageNum === 4 ? null : (
          <div className="text-right pr-20 mt-2">
            <AudioPlayer pageNum={pageNum} audioSrc={taleDetail['voice']} />
          </div>
        )}
        
        {pageNum === 4 || pageNum === 0 ? null : (
          <button
            onClick={() => setIsOrigin(!isOrigin)}
            className="w-[200px] h-[100px] absolute top-[115px] left-[90px] flex items-center cursor-pointer"
          >
            <img
              src="/Collection/fairy-magic.png"
              className="w-[100px] transition-transform duration-200 hover:scale-105"
              alt="그림 바꾸기"
            />
            {isOrigin ? (
              <span className="text-text-second service-regular3">AI 그림 보기</span>
            ) : (
              <span className="text-text-second service-regular3">원래 그림 보기</span>
            )}
          </button>
        )}
        
        {pageNum === 0 ? (
          <div>
            <img
              className="w-[340px] h-[340px] blur-[20px] absolute z-10 left-[148px] top-[195px]"
              src="/Sightseeing/test1.png"
              alt="블러 처리 이미지"
            />
            <img
              src="/Sightseeing/test1.png"
              alt="동화 만든 이미지"
              className="w-[300px] h-[300px] z-10 absolute left-[168px] top-[215px]"
            />
          </div>
        ) : (
          <div>
            <img
              className="w-[340px] h-[340px] blur-[20px] absolute z-10 left-[148px] top-[195px]"
              src="/TaleStart/test-story-start.jpg"
              alt="블러 처리 이미지"
            />
            <img
              src={taleStart['startImg']}
              alt="동화 만든 이미지"
              className="w-[300px] h-[300px] z-10 absolute left-[168px] top-[215px]"
            />
          </div>
        )}
        
        <div className="w-[378px] h-[430px] z-10 absolute right-[105px] top-[140px] flex flex-col justify-center items-center text-text-first story-basic2">
          <p className="text-text-first story-basic2"></p>
          {renderPageContent(pageNum)}
        </div>
        
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <TaleNavigation maxNum={4} pageNum={pageNum} setPageNum={setPageNum} />
        </div>
      </div>
    </div>
  );
};

export default CollectionModal;
