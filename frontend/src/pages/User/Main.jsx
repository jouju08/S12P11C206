import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { api, userStore } from '@/store/userStore';

import NavMenu from '@/components/Main/NavMenu';
import FairyTaleRoom from '@/components/Common/FairyTaleRoom';
import GalleryItem from '@/components/Common/GalleyItem';

import '@/styles/main.css';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';

import { Link } from 'react-router-dom';

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

export default function Main() {
  // 로그인 되어있는 유저 닉네임 가져오기
  const { nickname , profileImg, memberInfo, myPage} = userStore((state) => state);
  const [member, setMember]=useState(memberInfo||{});
  const [timeLeft, setTimeLeft] = useState(40); // 5분
  const [isWarning, setIsWarning]=useState(false);

  


  //페이지 랜더링 될때마다 유저 정보 불러오기
  useEffect(()=>{
    myPage();
  },[]);
  useEffect(()=>{
    if(memberInfo){
      setMember(memberInfo);
    }
  },[memberInfo]);

  const imgArray = [
    'nav-colored-pencils.png',
    'nav-book.png',
    'nav-drawing.png',
    'nav-proud.png',
  ];
  const menuArray = [
    <>
      동화 <br /> 만들기
    </>,
    <>
      내 동화 <br /> 책장
    </>,
    <>
      내 그림 <br /> 꾸러미
    </>,
    <>
      그림 <br /> 구경
    </>,
  ];

  // 만들어져 있는 동화방, 인기 그림 데이터 불러오기
  const [taleData, setTaleData] = useState([]);
  const [drawingData, setdrawingData] = useState([]);

  useEffect(() => {
    // 백엔드 API 호출 함수
    async function fetchData() {
      try {
        const response = await api.get('/tale/rooms');
        console.log('📌 만들어진 동화방 가져온 데이터:', response.data);
        setTaleData(response.data.data); // 상태에 저장
        // console.log(taleData);
      } catch (error) {
        console.error('만들어진 동화방 실패:', error);
      }
    }

    fetchData(); // 함수 실행
  }, []); // 빈 배열을 넣으면 컴포넌트가 처음 렌더링될 때만 실행됨

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get('/gallery', {
          params: { order: 'POP', page: 1 },
        });
        console.log('📌 인기있는 그림 데이터:', response.data); // 콘솔 출력
        setdrawingData(response.data.data); // 상태에 저장
      } catch (error) {
        console.error('인기있는 그림 실패:', error);
      }
    }

    fetchData(); // 함수 실행
  }, []);

  const linkArray = ['/room', '/collection', '/gallery', '/sightseeing'];
  const listNavMenu = imgArray.map((image, idx) => (
    <SwiperSlide
      key={idx}
      className="hover:-translate-y-1 hover:scale-105">
      <NavMenu
        location={image}
        linkTo={linkArray[idx]}>
        {menuArray[idx]}
      </NavMenu>
    </SwiperSlide>
  ));

  const listFairyTaleRoom = (taleData || []).map((item, idx) => (
    <SwiperSlide key={idx}>
      <FairyTaleRoom item={item} />
    </SwiperSlide>
  ));

  const listFamousDrawing = drawingData.map((item, idx) => (
    <SwiperSlide key={idx}>
      <GalleryItem item={item} />
    </SwiperSlide>
  ));

  return (
    <div>
      {/* 메인 페이지 상단 프로필, 메뉴바 section */}
      <div className=" w-[1024px] h-[440px] px-[60px] bg-[url(/Main/nav-background.png)] flex flex-row justify-between items-center relative">
        {/* 부모님 페이지 이동, 연결링크 수정 필요 */}
        <Link
          to={'/profile'}
          className="absolute top-[16px] right-[61px] font-NPSfont font-light text-gray-200 text-[14px]">
          부모님 페이지
        </Link>
        {/* 왼쪽 프로필 */}
        <div className="w-[294px] h-[317px] relative">
          {/* 로그인 정보 store에서 가져오기기 */}
          <img
            className="w-[150px] h-[150px] left-[128px] top-0 absolute rounded-[100px]"
            src={member.profileImg||'/Common/blank_profile.jpg'}
            alt="profileImg"
            />
      
          <img
            className="shaking-image w-[140px] h-[140px] left-[9px] top-0 absolute"
            src="/Main/main-fairy.png"
          />
          <div className="w-[271px] h-[180px] left-[10px] top-[123px] absolute">
            <img
              className="w-[271px] h-[180px] left-0 top-0 absolute"
              src="/Main/fairy-chat-bubble.png"
            />
            <div className="h-[68px] left-[36px] top-[74px] absolute flex-col justify-start items-start gap-1 inline-flex overflow-hidden">
              <div className="justify-start items-center gap-2 inline-flex overflow-hidden">
                {/* 로그인 정보 store에서 가져오기기 */}
                <div className="text-main-point service-accent3">
                  {member.nickname}
                </div>
                <div className="text-text-first service-accent3">어서 와!</div>
              </div>
              <div className="text-text-first service-accent3">
                오늘도 이야기를 만들자!
              </div>
            </div>
          </div>
        </div>

        {/* 오른쪽 메뉴바 */}
        <div className="w-[594px] h-[316px] py-[40px] ">
          <Swiper
            slidesPerView={3}
            spaceBetween={-10}
            grabCursor={true}
            className="mySwiper w-[509px] overflow-visible"
            style={{ padding: 20 }}>
            {listNavMenu}
          </Swiper>
        </div>
      </div>

      {/* 만들어진 동화방 */}
      <div className="mx-[60px] mt-[70px] w-[904px] h-[350px]">
        <div className="text-text-first service-accent2 mb-[10px]">
          만들어진 동화방
        </div>
        <div className="h-[300px] flex items-center text-center">
          {taleData ? (
            <Swiper
              slidesPerView={3}
              spaceBetween={-10}
              className="mySwiper w-[904px] overflow-hidden">
              {listFairyTaleRoom}
            </Swiper>
          ) : (
            // 데이터 없을 때 어떻게 나올지 수정 필요
            <div className="flex flex-col justify-center items-center mx-auto">
              <p className="text-text-second text-center service-accent3 mb-10">
                아직 만들어진 방이 없어요! 직접 시작하러 가볼까요?
              </p>
              <Link
                to={'/room'}
                className="px-3.5 py-2 bg-main-point2 rounded-[30px] shadow-[4px_4px_4px_0px_rgba(0,0,0,0.1)] justify-center items-center gap-2.5 text-white service-bold3 inline-flex overflow-hidden">
                동화 만들러 가기
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* 인기있는 그림 */}
      <div className="mx-[60px] my-[70px] w-[904px] h-[357px]">
        <div className="text-text-first service-accent2 mb-[10px]">
          지금 인기있는 그림
        </div>
        {drawingData.length != 0 ? (
          <Swiper
            slidesPerView={4}
            spaceBetween={30}
            grabCursor={true}
            className="mySwiper w-[904px] h-[300px] overflow-hidden px-4">
            {listFamousDrawing}
          </Swiper>
        ) : (
          // 데이터 없을 때 어떻게 나올지 수정 필요
          <div className="flex flex-col justify-center items-center mx-auto">
            <p className="text-text-second text-center service-accent3 mb-10">
              아직 올라온 게시물이 없어요! 직접 올리러 가볼까요?
            </p>
            <Link
              to={'/gallery'}
              className="px-3.5 py-2 bg-main-point2 rounded-[30px] shadow-[4px_4px_4px_0px_rgba(0,0,0,0.1)] justify-center items-center gap-2.5 text-white service-bold3 inline-flex overflow-hidden">
              올릴 사진 선택하러 가기
            </Link>
          </div>
        )}
      </div>
       
    </div>
  );
}
