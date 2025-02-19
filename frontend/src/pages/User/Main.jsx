import React from 'react';
import { useEffect, useState, useRef } from 'react';
import { api, userStore } from '@/store/userStore';

import NavMenu from '@/components/Main/NavMenu';
import FairyTaleRoom from '@/components/Common/FairyTaleRoom';
import GalleryItem from '@/components/Common/GalleyItem';

import '@/styles/main.css';
import '@/styles/text.css';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel, Scrollbar, Pagination } from 'swiper/modules';
import 'swiper/css';
import '@/styles/taleRoom.css';
import { Link } from 'react-router-dom';

export default function Main() {
  const { nickname, profileImg, memberInfo, myPage } = userStore(
    (state) => state
  );
  const [member, setMember] = useState(memberInfo || {});

  useEffect(() => {
    myPage();
  }, []);
  useEffect(() => {
    if (memberInfo) {
      setMember(memberInfo);
    }
  }, [memberInfo]);

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

  const [taleData, setTaleData] = useState([]);
  const [drawingData, setdrawingData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get('/tale/rooms');

        if (response.data.status === 'SU') {
          setTaleData(response.data.data); //
        } else {
          return;
        }
      } catch (error) {
        return;
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get('/gallery', {
          params: { order: 'POP', page: 1 },
        });

        if (response.data.status === 'SU') {
          setdrawingData(response.data.data);
        } else {
          return;
        }
      } catch (error) {
        return error;
      }
    }

    fetchData();
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
        <Link
          to={'/profile'}
          className="absolute top-[16px] right-[61px] font-NPSfont font-light text-gray-200 text-[14px]">
          부모님 페이지
        </Link>
        {/* 왼쪽 프로필 */}
        <div className="w-[294px] h-[317px] relative">
          <img
            className="w-[150px] h-[150px] left-[128px] top-0 absolute rounded-[100px] bg-white object-cover"
            src={member.profileImg || '/Common/blank_profile.jpg'}
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
            <div className="h-[68px] left-[34px] top-[74px] absolute flex-col justify-start items-start gap-1 inline-flex overflow-hidden">
              <div className="justify-start items-center gap-1.5 inline-flex overflow-hidden">
                <div className="text-main-carrot service-accent3 max-w-[120px] h-fit truncate hover:animate-marquee">
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
            modules={[Mousewheel, Scrollbar, Pagination]}
            mousewheel={true}
            scrollbar={{
              draggable: true,
              hide: false,
              el: '.swiper-scrollbar',
              dragSize: 350,
            }}
            slidesPerView={3.2}
            spaceBetween={20}
            grabCursor={true}
            className="mySwiper w-[509px] overflow-visible relative"
            style={{ padding: 20 }}>
            {listNavMenu}
            <div class="swiper-pagination"></div>
            <div class="swiper-scrollbar bg-gray-200 rounded-sm h-[5px] w-[200px] absolute bottom-0 left-1/2 -translate-x-1/2"></div>{' '}
          </Swiper>
        </div>
      </div>

      {/* 인기있는 그림 */}
      <div className="mx-[60px] my-[70px] w-[904px] h-[357px]">
        <div className="text-text-first service-accent2 mb-[10px]">
          지금 인기있는 그림
        </div>
        {drawingData && drawingData.length != 0 ? (
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
