import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useMyPictures } from '@/store/galleryStore';

import '@/styles/shakingDown.css';

const ImageModal = ({ isOpen, onClose, detail }) => {
  if (!isOpen) return null;

  const [isOriginal, setIsOriginal] = useState(true);
  const formattedDate = detail?.createdAt ? detail.createdAt.split('T')[0] : '';

  const { uploadGallery } = useMyPictures();

  const handleShowOff = async () => {
    if (detail && detail.id) {
      const payload = {
        taleMemberId: detail.id,
        hasOrigin: isOriginal,
      };
      try {
        const status = await uploadGallery(payload);

        if (status == 'SU') {
          Swal.fire({
            icon: 'success',
            title: '성공',
            text: '그림 자랑하기에 성공했습니다.',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: '실패',
            text: '내일 자랑해주세요.',
          });
        }
      } catch (error) {
        console.error('그림 자랑하기 실패:', error);
        Swal.fire({
          icon: 'error',
          title: '실패',
          text: '그림 자랑하기에 실패했습니다.',
        });
      }
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}></div>
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="relative w-[650px] h-[500px] bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="h-[65px] bg-[#FDF8DC] flex items-center justify-center relative">
            <span className="service-bold1 text-[28px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              그림 자세히 보기
            </span>
            <button
              onClick={onClose}
              className="w-10 h-10 absolute right-4 top-1/2 transform -translate-y-1/2 bg-main-choose rounded-full flex justify-center items-center">
              <img
                src="/Common/close.png"
                alt="닫기"
              />
            </button>
          </div>

          <div className="h-[435px] p-4 flex">
            {/* 왼쪽 이미지 영역 */}
            <div className="w-[400px] h-[400px] relative overflow-hidden mr-4">
              {isOriginal ? (
                <>
                  {detail?.img && (
                    <img
                      src={isOriginal ? detail?.orginImg : detail?.img}
                      alt={detail?.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </>
              ) : (
                <>
                  {/* 이미지가 없거나, AI 서버에서 아직 처리중인 경우, 마찬가지로 대체 이미지를 보여줍니다. */}
                  {!detail?.img ||
                  detail?.img === 'processing' ||
                  detail?.img === 'before processing' ? (
                    <div className="flex flex-col mt-[150px] items-center justify-center">
                      <img
                        src="/Gallery/movingDuck.gif"
                        alt="대체 이미지"
                        className="w-[150px] h-[150PX] object-cover object-center bg-white"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col mt-[150px] items-center justify-center">
                      <img
                        src={detail.img}
                        alt="대체 이미지"
                        className="w-[150px] h-[150PX] object-cover object-center bg-white"
                      />
                    </div>
                  )}
                </>
              )}

              <span className="service-bold3 absolute top-2 left-2 inline-block bg-white/80 text-black px-2 py-1 rounded text-base">
                {detail?.title}
              </span>
              <span className="service-regular3 absolute bottom-2 right-2 inline-block bg-white/70 text-black px-2 py-1 rounded text-sm">
                {formattedDate}
              </span>
            </div>

            {/* 오른쪽 영역 */}
            <div className="flex-1 flex flex-col justify-between items-center">
              <div
                onClick={() => setIsOriginal(!isOriginal)}
                className="flex relative items-start cursor-pointer hover:scale-105 transition-all">
                <div
                  className="
                    relative
                    h-20 w-24
                    bg-[url('/Sightseeing/change-fairy-chat.png')]
                    bg-cover object-center
                  ">
                  <p className="story-basic4 absolute w-full top-1/2 left-1/2 -translate-x-1/3 -translate-y-1/2">
                    날 눌러봐!
                    <br />
                    사진이 <br />
                    바뀔거야
                  </p>
                </div>
                <img
                  src="/Sightseeing/change-fairy.png"
                  alt="fairy"
                  className="w-[80px] h-[80px] ml-2 shaking-image"
                />
              </div>

              <div className="flex flex-col items-center my-4">
                <img
                  src="/Sightseeing/frame.png"
                  alt="frame"
                />
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
                  ">
                  {detail?.imgScript}
                </p>
                <img
                  src="/Sightseeing/frame.png"
                  alt="frame reversed"
                  className="rotate-180"
                />
              </div>

              <button
                onClick={handleShowOff}
                className="w-[195px] h-[56px] bg-[#FFC300] rounded-[50px] border border-gray-100 flex items-center justify-center service-bold3 text-text-second transition-all duration-200 hover:bg-main-carrot">
                <img
                  src="/Gallery/painter.png"
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
