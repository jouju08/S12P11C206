import React, { useEffect, useState, useRef } from 'react';
import { useSightseeing } from '@/store/sightseeingStore';
import { Link } from 'react-router-dom';
import GalleryItem from '@/components/Common/GalleyItem';

const dummyDrawingList = [
  {
    galleryId: 4,
    img: 'https://myfairy-c206.s3.ap-northeast-2.amazonaws.com/tale1.png',
    authorId: 5,
    authorNickname: '테스터',
    authorProfileImg: null,
    hasLiked: false,
    likeCnt: 0,
    createdAt: '2025-02-07T11:04:57.572662600',
  },
  {
    galleryId: 3,
    img: 'https://myfairy-c206.s3.ap-northeast-2.amazonaws.com/tale1.png',
    authorId: 5,
    authorNickname: '테스터',
    authorProfileImg: null,
    hasLiked: true,
    likeCnt: 10,
    createdAt: '2025-02-07T11:02:57.843395',
  },
  {
    galleryId: 2,
    img: 'https://myfairy-c206.s3.ap-northeast-2.amazonaws.com/tale1.png',
    authorId: 5,
    authorNickname: '테스터',
    authorProfileImg: null,
    hasLiked: false,
    likeCnt: 0,
    createdAt: '2025-02-06T15:23:24.819179600',
  },
  {
    galleryId: 1,
    img: 'https://myfairy-c206.s3.ap-northeast-2.amazonaws.com/tale1.png',
    authorId: 5,
    authorNickname: '테스터',
    authorProfileImg: null,
    hasLiked: false,
    likeCnt: 1,
    createdAt: '2025-02-06T15:20:39.791333600',
  },
];

export default function Sightseeing() {
  // const [sortBy, setSortBy] = useState('최신순');
  const { drawingList, setDrawingList, sortBy, setSortBy } = useSightseeing();

  useEffect(() => {
    setDrawingList();
  }, [setDrawingList]);

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

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

        {/* 3등 이름 */}
        <div className="w-[145px] h-[89px] absolute bottom-1 left-[248px] px-3 flex-col justify-center items-center gap-px inline-flex overflow-hidden">
          <img
            className="w-[58px] h-[58px] relative rounded-[100px]"
            src="/Main/profile-img.png"
          />
          <div className="text-center text-white service-bold3">닉네임213</div>
        </div>

        {/* 3등 이미지 */}
        <Link to={'/'}>
          <img
            className="w-[145px] h-[145px] shadow-[4px_4px_4px_0px_rgba(0,0,0,0.25)] absolute origin-top-left top-[267px] left-[253px] ]"
            src="/Sightseeing/test1.png"
          />
        </Link>

        {/* 1등 이름 */}
        <div className="w-[145px] h-[89px] absolute bottom-[14px] left-[411px] px-3 flex-col justify-center items-center gap-px inline-flex overflow-hidden">
          <img
            className="w-[58px] h-[58px] relative rounded-[100px]"
            src="/Main/profile-img.png"
          />
          <div className="text-center text-white service-bold3">닉네임213</div>
        </div>

        {/* 1등 이미지 */}
        <Link>
          <img
            className="w-[145px] h-[145px] shadow-[4px_4px_4px_0px_rgba(0,0,0,0.25)] absolute origin-top-left top-[206px] left-[414px] ]"
            src="/Sightseeing/test2.png"
          />
        </Link>

        {/* 2등 이름 */}
        <div className="w-[145px] h-[89px] absolute bottom-1 right-[253px] px-3 flex-col justify-center items-center gap-px inline-flex overflow-hidden">
          <img
            className="w-[58px] h-[58px] relative rounded-[100px]"
            src="/Main/profile-img.png"
          />
          <div className="text-center text-white service-bold3">닉네임213</div>
        </div>

        {/* 2등 이미지 */}
        <Link>
          <img
            className="w-[145px] h-[145px] shadow-[4px_4px_4px_0px_rgba(0,0,0,0.25)] absolute origin-top-left top-[292px] right-[248px] ]"
            src="/Sightseeing/test3.png"
          />
        </Link>
      </div>

      {/* 작품 갤러리 */}
      <div className="w-[974px] h-fit px-[22px] mb-[30px]">
        <h1 className="service-accent2 mt-[10px] ">작품 갤러리</h1>
        {/* 정렬 선택 */}
        <div className="text-right">
          <select
            value={sortBy}
            onChange={handleSortChange}
            className="mr-4 border bg-white rounded-md service-regular2 px-4 w-[180px] h-[40px] relative z-50">
            <option value="date">최신순</option>
            <option value="famous">인기순</option>
          </select>
        </div>

        {/* 그림 목록 */}
        <div className="grid grid-flow-row grid-cols-4 gap-4 mt-[30px]">
          {drawingList.length === 0
            ? // <div className="w-full h-[300px] service-accent1 text-text-first text-center leading-[300px]">
              //   아직 게시글이 없어요!
              // </div>
              dummyDrawingList.map((item, idx) => (
                <GalleryItem
                  item={item}
                  key={idx}
                />
              ))
            : drawingList.map((item, idx) => (
                <GalleryItem
                  item={item}
                  key={idx}
                />
              ))}
        </div>
      </div>
    </div>
  );
}
