import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { userStore } from '@/store/userStore';

import NavMenu from '@/components/Main/NavMenu';
import FairyTaleRoom from '@/components/Common/FairyTaleRoom';
import GalleryItem from '@/components/Common/GalleyItem';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import { Link } from 'react-router-dom';

export default function Main() {
  // 로그인 되어있는 유저 닉네임 가져오기
  const { nickname } = userStore((state) => state);

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

  // 백엔드에서 만들어져 있는 동화방 데이터 불러오기
  const [taleData, setTaleData] = useState([]);

  useEffect(() => {
    // 백엔드 API 호출 함수
    async function fetchData() {
      try {
        const response = await axios.get('/api/tale/rooms');
        // console.log('📌 가져온 데이터:', response.data); // 콘솔 출력
        setTaleData(response.data.data); // 상태에 저장
        // console.log(taleData);
      } catch (error) {
        console.error('데이터 가져오기 실패:', error);
      }
    }

    fetchData(); // 함수 실행
  }, []); // 빈 배열을 넣으면 컴포넌트가 처음 렌더링될 때만 실행됨

  const linkArray = ['/room', '/collection', '/gallery', '/'];
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

  const listFamousDrawing = new Array(5).fill(null).map((_, idx) => (
    <SwiperSlide key={idx}>
      <GalleryItem />
    </SwiperSlide>
  ));

  return (
    <div>
      {/* 메인 페이지 상단 프로필, 메뉴바 section */}
      <div className=" w-[1024px] h-[440px] px-[60px] bg-[url(/Main/nav-background.png)] flex flex-row justify-between items-center relative">
        {/* 부모님 페이지 이동, 연결링크 수정 필요 */}
        <a
          href="#"
          className="absolute top-[16px] right-[61px] font-NPSfont font-light text-gray-200 text-[14px]">
          부모님 페이지
        </a>
        {/* 왼쪽 프로필 */}
        <div className="w-[294px] h-[317px] relative">
          {/* 로그인 정보 store에서 가져오기기 */}
          <img
            className="w-[150px] h-[150px] left-[128px] top-0 absolute rounded-[100px]"
            src="/Main/profile-img.png"
          />
          <img
            className="w-[140px] h-[140px] left-[9px] top-0 absolute"
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
                  {nickname}
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
        <div className="h-[270px]">
          <Swiper
            slidesPerView={3}
            spaceBetween={-10}
            className="mySwiper w-[904px] overflow-hidden">
            {listFairyTaleRoom}
          </Swiper>
        </div>
      </div>

      {/* 인기있는 그림 */}
      <div className="mx-[60px] my-[70px] w-[904px] h-[357px]">
        <div className="text-text-first service-accent2 mb-[10px]">
          지금 인기있는 그림
        </div>
        <Swiper
          slidesPerView={4}
          spaceBetween={30}
          grabCursor={true}
          className="mySwiper w-[904px] h-[300px] overflow-hidden px-4">
          {listFamousDrawing}
        </Swiper>
      </div>
    </div>
  );
}
