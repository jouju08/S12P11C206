import React from 'react';

const ImageModal = ({ isOpen, onClose, detail }) => {
  if (!isOpen) return null;

  // createdAt이 "2025-02-07 22:03:54"와 같이 들어온다고 가정하고,
  // 공백을 기준으로 첫 부분(년-월-일)만 추출합니다.
  const formattedDate = detail?.createdAt ? detail.createdAt.split(" ")[0] : "2025-01-13";

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      ></div>
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="relative w-[650px] h-[500px] bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="h-[65px] bg-[#FDF8DC] flex items-center justify-center relative">
            <span className="service-bold1 text-[28px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              그림 자세히 보기
            </span>
            <button
              onClick={onClose}
              className="w-10 h-10 absolute right-4 top-1/2 transform -translate-y-1/2 bg-main-choose rounded-full flex justify-center items-center"
            >
              <img src="/Common/close.png" alt="닫기" />
            </button>
          </div>

          <div className="h-[435px] p-4 flex">
            {/* 왼쪽 이미지 영역 */}
            <div className="w-[400px] h-[400px] relative overflow-hidden mr-4">
              <img
                src={detail?.orginImg || "/TaleStart/test-story-start.jpg"}
                alt={detail?.title || "아기 돼지 삼형제"}
                className="w-full h-full object-cover"
              />
              <span className="service-bold3 absolute top-2 left-2 inline-block bg-white/80 text-black px-2 py-1 rounded text-base">
                {detail?.title || "아기 돼지 삼형제"}
              </span>
              <span className="service-regular3 absolute bottom-2 right-2 inline-block bg-white/70 text-black px-2 py-1 rounded text-sm">
                {formattedDate}
              </span>
            </div>

            {/* 오른쪽 영역 */}
            <div className="flex-1 flex flex-col justify-between items-center">
              {/* 첫 번째 말풍선 (왼쪽의 노란 말풍선) - 정적 텍스트 유지 */}
              <div className="flex items-start">
                <div
                  className="
                    relative
                    w-[160px] min-h-[90px]
                    bg-[#FFEDED]
                    rounded-[10px]
                    px-3 py-2
                    text-[14px] leading-tight
                    whitespace-normal break-words
                    flex flex-col justify-center
                    after:content-['']
                    after:absolute
                    after:border-solid
                    after:border-y-[4px]
                    after:border-r-[16px]
                    after:border-l-0
                    after:border-transparent
                    after:border-r-[#FFEDED]
                    after:w-0
                    after:z-[1]
                    after:right-[-15px]
                    after:top-1/2
                    after:-translate-y-[400%]
                    after:transform
                    after:origin-center
                    after:rotate-180
                    shadow-[4px_4px_4px_rgba(0,0,0,0.1),4px_4px_4px_rgba(0,0,0,0.1)]
                    after:shadow-[4px_4px_4px_rgba(0,0,0,0.10),px_4px_4px_rgba(0,0,0,0.1)]
                  "
                >
                  <p className="story-basic4">
                    날 눌러봐!<br />
                    마법의 가루를 <br />
                    뿌려줄게~
                  </p>
                </div>
                <img
                  src="/image/fairy.png"
                  alt="fairy"
                  className="w-[80px] h-[80px] ml-2"
                />
              </div>

              {/* 두 번째 말풍선 - script 값으로 변경 (fallback은 기존 텍스트) */}
              <div className="flex flex-col items-center my-4">
                <img src="/image/vintage.png" alt="vintage" />
                <p
                  className="
                    service-regular3 
                    text-[16px] 
                    text-black 
                    text-center 
                    my-2 
                    whitespace-normal 
                    break-words 
                    px-2
                  "
                >
                  {detail?.script || "첫째 돼지는 구름으로 집을 지었어요"}
                </p>
                <img
                  src="/image/vintage.png"
                  alt="vintage reversed"
                  className="rotate-180"
                />
              </div>

              <button
                className="w-[195px] h-[56px] bg-[#FFC300]
                           rounded-[50px] border border-[#9F9F9F]
                           flex items-center justify-center 
                           text-[20px] text-[#515151] font-bold mb-2"
              >
                <img
                  src="/image/painter.png"
                  alt="painter"
                  className="w-[40px] h-[40px] mr-2"
                />
                그림 자랑하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ImageModal;
