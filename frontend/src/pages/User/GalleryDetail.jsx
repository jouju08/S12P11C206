import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

export default function GalleryDetail() {
  const { galleryId } = useParams(); // URL에서 galleryId 추출
  return (
    <div className="w-[1024px] h-fit px-[25px]">
      {/* 뒤로 돌아가기 */}
      <div className="w-[974px] h-[50px]">
        <Link
          to={'/sightseeing'}
          className="ml-[20px] justify-center items-center inline-flex overflow-hidden">
          <img
            src="/Sightseeing/left.png"
            alt="돌아가기"
            className="w-[50px] h-[50px] relative overflow-hidden"
          />
          <div className="text-text-second service-bold2">돌아가기</div>
        </Link>
      </div>

      {/* 본문 */}
      <div className="w-[974px] h-[540px] mt-[30px] relative flex justify-between items-center">
        {/* 이미지 */}
        <div className="w-[540px] h-[540px]">
          <img
            src="/Main/famous-drawing-test.png"
            alt="그림"
            className="w-full h-full"
          />
        </div>

        {/* 그림 상세내용 */}
        <div className="w-[400px] h-[540px] p-4 relative bg-white overflow-hidden">
          <p className="text-text-second service-regular3">2025.01.13</p>
          <p className="text-text-first service-bold2 mt-[10px]">
            아기 돼지 삼형제
          </p>

          {/* 좋아요 토글 */}
          <div className="mt-[16px] justify-start items-center gap-2 inline-flex overflow-hidden">
            <div className="w-6 h-6">
              {/* 로그인 되어 있는 유저가 찜했는 가 안 했는가 조건부 렌더링 */}
              <img
                src="/Common/fill-heart.png"
                alt="좋아요 아이콘"
              />
            </div>
            {/* 그림의 좋아요(추천) 수 */}
            <div className="text-text-second service-regular3">12</div>
          </div>

          <div className="w-full mt-[10px] justify-between items-center inline-flex overflow-hidden">
            <div className="w-fit justify-start items-center gap-4 flex overflow-hidden">
              <div className="w-[50px] h-[50px] rounded-full overflow-hidden">
                <img
                  className="w-full h-full object-cover object-center"
                  src="/Main/profile-img.png"
                />
              </div>
              <p className="text-text-first service-regular3">닉네임</p>
            </div>
            {/* 여기 나중에 ChildrenBtn 컴포넌트 */}
            <div className="p-2 bg-[#ffc8a3] rounded-2xl shadow-[3px_3px_4px_0px_rgba(0,0,0,0.10)] justify-center items-center gap-2.5 flex overflow-hidden">
              <div className="text-[#505050] text-base font-normal font-['NPS font']">
                + 친구추가
              </div>
            </div>
          </div>

          {/* 그림 그린 내용 */}
          <div className="w-full h-[240px] left-0 top-[197px] absolute flex-col justify-between items-center gap-2.5 inline-flex overflow-hidden">
            <img
              className="bg-center"
              src="/Sightseeing/frame.png"
            />
            <div className="text-center text-text-first story-basic3">
              첫째 돼지는 구름으로 집을 지었어요
            </div>
            <img
              className="bg-center -scale-y-100"
              src="/Sightseeing/frame.png"
            />
          </div>

          {/* 그림 바꿔주는 요정 */}
          <button className="left-[10px] top-[447px] absolute flex transition-all ease-linear hover:scale-105">
            <img
              className="w-20 h-20"
              src="/Sightseeing/change-fairy.png"
              alt="그림 바꿔주는 요정"
            />
            <div className="text-center">
              <img
                className="h-[84px] -scale-x-100"
                src="/Sightseeing/change-fairy-chat.png"
                alt="요정 말"
              />
              <span className="left-[110px] top-[5px] absolute text-text-second font-CuteFont">
                날 눌러봐! <br /> 사진이 <br /> 바뀔거야
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
