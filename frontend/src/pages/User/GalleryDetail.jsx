import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGalleryDetail } from '@/store/galleryDetailStore';

// 더미 데이터 - 내가 그린 문장이 뭔지도 들어와야 함
const dummyGalleryPage = {
  galleryId: 1,
  taleTitle: '아기돼지 3형제',
  img: 'https://myfairy-c206.s3.ap-northeast-2.amazonaws.com/tale1.png',
  originImg: 'https://myfairy-c206.s3.ap-northeast-2.amazonaws.com/tale1.png',
  author: '테스터',
  authorMemberId: 5,
  taleId: 301,
  sentence: '[이번] ㅇㅇㅇㅇ',
  baseTaleId: 1,
  likeCount: 1,
  hasOrigin: true,
  hasLiked: true,
  createdAt: '2025-02-05T16:31:14.170944900',
};

export default function GalleryDetail() {
  const { galleryId } = useParams(); // URL에서 galleryId 추출
  const navigate = useNavigate();

  const [isOrigin, setIsOrigin] = useState(false);
  const { galleryPage, setGalleryPage, toggleHasLiked } = useGalleryDetail();

  useEffect(() => {
    const fetchGalleryPage = async () => {
      await setGalleryPage(galleryId);
      setIsOrigin(galleryPage['hasOrigin']);
    };

    fetchGalleryPage();
  }, [galleryId]);

  const handleHeart = () => {
    dummyGalleryPage['hasLiked'] = !dummyGalleryPage['hasLiked'];
    toggleHasLiked();
  };

  return (
    <div className="w-[1024px] h-fit px-[25px]">
      {/* 뒤로 돌아가기 */}
      <div className="w-[974px] h-[50px]">
        <button
          onClick={() => navigate(-1)}
          className="ml-[20px] justify-center items-center inline-flex overflow-hidden">
          <img
            src="/Sightseeing/left.png"
            alt="돌아가기"
            className="w-[50px] h-[50px] relative overflow-hidden"
          />
          <div className="text-text-second service-bold2">돌아가기</div>
        </button>
      </div>

      {/* 본문 */}
      <div className="w-[974px] h-[540px] mt-[30px] relative flex justify-between items-center">
        {/* 이미지 */}
        <div className="w-[540px] h-[540px]">
          <img
            src={isOrigin ? galleryPage['originImg'] : galleryPage['img']}
            alt="그림"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* 그림 상세내용 */}
        <div className="w-[400px] h-[540px] p-4 relative bg-white overflow-hidden">
          <p className="text-text-second service-regular3">
            {galleryPage['createdAt']
              ? galleryPage['createdAt'].slice(0, 10)
              : 'createdAt이 안 들어가 잇서여'}
          </p>
          <p className="text-text-first service-bold2 mt-[10px]">
            {galleryPage['taleTitle']}
          </p>

          {/* 좋아요 토글 */}
          <div className="mt-[16px] justify-start items-center gap-2 inline-flex overflow-hidden">
            <div
              className="w-6 h-6 cursor-pointer"
              onClick={handleHeart}>
              {/* 로그인 되어 있는 유저가 찜했는 가 안 했는가 조건부 렌더링 */}
              <img
                src={
                  galleryPage['hasLiked']
                    ? '/Common/fill-heart.png'
                    : '/Common/heart.png'
                }
                alt="좋아요 아이콘"
              />
            </div>
            {/* 그림의 좋아요(추천) 수 */}
            <div className="text-text-second service-regular3">
              {galleryPage['likeCount']}
            </div>
          </div>

          <div className="w-full mt-[10px] justify-between items-center inline-flex overflow-hidden">
            <div className="w-fit justify-start items-center gap-4 flex overflow-hidden">
              <div className="w-[50px] h-[50px] rounded-full overflow-hidden">
                <img
                  className="w-full h-full object-cover object-center"
                  src="/Main/profile-img.png"
                />
              </div>
              {/* 작성자 이름 */}
              <p className="text-text-first service-regular3">
                {galleryPage['author']}
              </p>
            </div>
            {/* 여기 나중에 ChildrenBtn 컴포넌트 */}
            {/* <div className="p-2 bg-[#ffc8a3] rounded-2xl shadow-[3px_3px_4px_0px_rgba(0,0,0,0.10)] justify-center items-center gap-2.5 flex overflow-hidden">
              <div className="text-[#505050] text-base font-normal font-['NPS font']">
                + 친구추가
              </div>
            </div> */}
          </div>

          {/* 그림 그린 내용 */}
          <div className="w-full h-[240px] left-0 top-[197px] absolute flex-col justify-between items-center gap-2.5 inline-flex overflow-hidden">
            <img
              className="bg-center"
              src="/Sightseeing/frame.png"
            />
            <div className="text-center text-text-first story-basic3">
              {galleryPage['sentence']}
            </div>
            <img
              className="bg-center -scale-y-100"
              src="/Sightseeing/frame.png"
            />
          </div>

          {/* 그림 바꿔주는 요정 */}
          <button
            onClick={() => setIsOrigin(!isOrigin)}
            className="left-[10px] top-[447px] absolute flex transition-all ease-linear hover:scale-105">
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
