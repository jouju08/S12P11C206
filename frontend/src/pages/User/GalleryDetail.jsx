import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGalleryDetail } from '@/store/galleryDetailStore';
import { useCollection } from '@/store/collectionStore';
import '@/styles/shakingDown.css';
import CollectionModal from '@/components/modal/CollectionModal';

export default function GalleryDetail() {
  const { galleryId } = useParams(); // URL에서 galleryId 추출
  const navigate = useNavigate();

  const [isOrigin, setIsOrigin] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { galleryPage, setGalleryPage, toggleHasLiked } = useGalleryDetail();
  const { taleStart, setTaleStart, setSeeTaleId } = useCollection();

  const [text, setText] = useState('');
  const loadingText = ' 이미지 로딩중...';
  const typingSpeed = 200;
  const delayBeforeRestart = 1000;

  useEffect(() => {
    //이미지 로딩 글자 효과
    let i = 0;
    const interval = setInterval(() => {
      setText(loadingText.slice(0, i + 1));
      i++;
      if (i === loadingText.length) {
        setTimeout(() => {
          i = 0;
        }, delayBeforeRestart);
      }
    }, typingSpeed);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setGalleryPage(galleryId);
  }, [galleryId]);

  useEffect(() => {
    if (galleryPage) {
      setIsOrigin(galleryPage['hasOrigin']);
    }
  }, [galleryPage]);

  const handleHeart = () => {
    toggleHasLiked();
  };

  const handleClick = () => {
    setShowModal(true);
    setTaleStart(galleryPage['baseTaleId']);
    setSeeTaleId(galleryPage['taleId']);
  };

  const handleExit = () => {
    setShowModal(false);
  };

  return (
    <>
      <div className="w-[1024px] h-fit px-[25px] relative">
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
          <div className="w-[540px] h-[540px] bg-white">
            {isOrigin && galleryPage['originImg'] && (
              <img
                src={galleryPage['originImg']}
                alt="그림"
                className="w-full h-full object-cover object-center bg-white"
              />
            )}
            {!isOrigin && galleryPage['img'] && (
              <img
                src={galleryPage['img']}
                alt="그림"
                className="w-full h-full object-cover object-center bg-white"
              />
            )}
            {/* 이미지가 없거나, AI 서버에서 아직 처리중인 경우, 마찬가지로 대체 이미지를 보여줍니다. */}
            {!isOrigin &&
              (!galleryPage['img'] ||
                galleryPage['img'] === 'processing' ||
                galleryPage['img'] === 'before processing') && (
                <div className="flex flex-col mt-[150px] items-center justify-center">
                  <img
                    src="/Gallery/movingDuck.gif"
                    alt="대체 이미지"
                    className="w-[150px] h-[150PX] object-cover object-center bg-white"
                  />
                  <div className="text-text-first text-xl font-NPSfont">
                    {text}
                  </div>
                </div>
              )}
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
                    src={galleryPage['authorProfileImg']}
                  />
                </div>
                {/* 작성자 이름 */}
                <p className="text-text-first service-regular3">
                  {galleryPage['author']}
                </p>
              </div>
              {/* 여기 나중에 ChildrenBtn 컴포넌트 */}
            </div>

            {/* 그림 그린 내용 */}
            <div className="w-full h-[240px] left-0 top-[197px] absolute flex-col justify-between items-center gap-2.5 inline-flex overflow-hidden">
              <img
                className="bg-center"
                src="/Sightseeing/frame.png"
              />
              <div className="text-center text-text-first story-basic3 mx-5">
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
                className="w-20 h-20 shaking-image"
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
        {/* ai 동화 보러가기 */}
        <div
          onClick={() => handleClick()}
          className="cursor-pointer">
          <div className="w-[140px] h-32 pl-3 pt-1 bg-[url('/TaleStart/chat.png')] bg-contain object-contain bg-no-repeat absolute right-[110px] top-[0px] service-regular3 text-text-first">
            이 그림 그려진
            <br />
            동화 보러가기
          </div>
          <button className="w-20 h-20 bg-[url('/Room/together.png')] bg-contain bg-center object-center bg-no-repeat absolute right-[30px] top-[0px] service-regular2 text-text-first hover:scale-105 transition-all duration-200" />
        </div>
      </div>
      {showModal && (
        <div className="absolute top-[-100px] left-0 z-50 w-screen h-screen bg-[rgba(0,0,0,0.5)] flex justify-center items-center">
          <CollectionModal handleExit={handleExit} />
        </div>
      )}
    </>
  );
}
