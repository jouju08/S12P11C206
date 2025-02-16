import AuthHeader from '@/common/Header/AuthHeader';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '@/store/userStore';

import '@/styles/main.css';
import '@/styles/Hero.css';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules'; // Autoplay 모듈 가져오기
// Import Swiper styles
import 'swiper/css';

export default function Hero() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/main');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;

      // 스크롤 이상인지 확인
      if (scrollPosition > 150) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="w-full h-fit">
      {/* 로그인 하러 가기 -fixed */}
      <Link
        to={'/login'}
        className="h-[10%] fixed z-50 bottom-[3rem] left-1/2 -translate-x-1/2 -translate-y-1/2 px-[6rem] py-[1rem] bg-gradient-to-b from-[#fff4d5] to-[#ffe390] rounded-[100px] shadow-[0px_4px_4px_0px_rgba(189,154,42,0.42)] justify-center items-center gap-2.5 inline-flex overflow-hidden">
        <div className="text-[#282828] text-[2rem] font-extrabold font-WantedFont">
          시작하기
        </div>
      </Link>

      {/* 동영상 부분 */}
      <div className="relative w-full h-dvh">
        {/* 로고 */}
        <img
          src="/Common/logo-blue.png"
          alt="로고이미지"
          className="w-[141px] h-[70px] z-10 absolute left-1/2 top-16 -translate-x-1/2 -translate-y-1/2"
        />
        <div className="text-center text-[#fcfaff] text-[58px] xl:text-[78px] font-extrabold font-NPSfont leading-[180%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          상상하고 표현하는
          <br />
          마이페어리
        </div>
        <img
          src="/Hero/down.png"
          alt="아래로"
          className="shaking-image w-9 xl:w-14 absolute bottom-[1rem] left-[48%] -translate-x-1/2 -translate-y-1/2"
        />
        <div className="w-full h-dvh bg-[rgba(256,256,256,0.2)] absolute top-[0px] left-0"></div>
        <video
          autoPlay
          muted
          playsInline
          loop
          preload="auto"
          className="w-full h-full object-cover"
          src="https://myfairy-c206.s3.ap-northeast-2.amazonaws.com/static/hero.mp4"></video>
      </div>

      {/* 아이들 고른 단어로~ */}
      <div className="w-full h-[650px] relative overflow-hidden p-[4rem] bg-white">
        <img
          src="/Hero/service-cut.png"
          alt="서비스 사진"
          className={`background-image ${isScrolled ? 'translate-y-[70%] -translate-x-[80%] opacity-100 xl:translate-y-[25%]' : ''}`}></img>
        <div className="text-text-first text-4xl font-extrabold font-NPSfont xl:text-5xl">
          <p className=" leading-[180%]">아이들이 고른 단어로</p>
          <p>새로운 이야기가 탄생!</p>
        </div>
        <div className="z-10 text-text-second text-2xl font-medium font-WantedFont mt-[2rem]">
          '만약 주인공이 이랬다면?'
          <br />
          아이들 호기심을 이끌어내서
          <br /> 상상력을 키울 수 있어요
        </div>
      </div>

      {/* 태블릿 */}
      <div className="w-full h-[650px] relative overflow-hidden p-[4rem] bg-[url('/Hero/tablet-background.png')] bg-cover object-bottom">
        <img
          src="/Hero/tablet.png"
          alt="태블릿 사진"
          className="absolute bottom-[70px] left-[10%]"
        />
        <div className="text-text-first text-right text-4xl font-extrabold font-NPSfont xl:text-5xl">
          <p className=" leading-[180%]">태블릿으로 손쉽게</p>
          <p>시작할 수 있어요</p>
        </div>
        <div className="text-text-second text-right text-2xl font-medium font-WantedFont mt-[2rem]">
          또래 친구들과
          <br />
          함께 동화 속 그림을 그리고
          <br /> 나만의 동화책을 만들어 보아요
        </div>
      </div>

      {/* ai */}
      <div className="w-full h-[650px] relative overflow-hidden p-[4rem] bg-[url('/Hero/ai-background.jpg')] bg-cover object-bottom">
        <div className="text-text-first text-center mx-auto text-4xl font-extrabold font-NPSfont xl:text-5xl">
          <p className=" leading-[180%]">아이들의 그림을 더 멋있게,</p>
          <p>AI 기술을 도입했어요</p>
        </div>
        <div className="mt-[4.5rem]">
          <Swiper
            modules={[Autoplay]} // Autoplay 모듈 등록
            // freeMode={true}
            // slidesPerView="auto"
            // slidesPerView="4"
            spaceBetween={0}
            speed={6000}
            allowTouchMove={false}
            autoplay={{
              delay: 0,
              disableOnInteraction: false,
            }}
            breakpoints={{
              768: {
                slidesPerView: 1.5,
                spaceBetween: 40,
              },
              1024: {
                slidesPerView: 2.2,
                spaceBetween: 50,
              },
              1300: {
                slidesPerView: 2.8,
                spaceBetween: 50,
              },
              1420: {
                slidesPerView: 3.5,
                spaceBetween: 50,
              },
            }}
            loop={true}
            className="mySwiper">
            <SwiperSlide>
              <div className="w-[400px] h-[270px] rounded-[50px] bg-[url('/Hero/ai1.png')] bg-cover object-center overflow-hidden">
                <div className="w-full h-full bg-[rgba(0,0,0,0.2)] flex justify-center items-center">
                  <p className="text-3xl font-bold font-NPSfont leading-[180%] text-center text-white">
                    요정이 읽어주는 <br /> 나만의 동화
                  </p>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="w-[400px] h-[270px] rounded-[50px] bg-[url('/Hero/ai2.gif')] bg-cover object-center overflow-hidden">
                <div className="w-full h-full bg-[rgba(0,0,0,0.2)] flex justify-center items-center">
                  <p className="text-3xl font-bold font-NPSfont leading-[180%] text-center text-white">
                    요정이 바꿔주는 <br /> 아이 그림
                  </p>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="w-[400px] h-[270px] rounded-[50px] bg-[url('/Hero/ai3.png')] bg-cover object-center overflow-hidden">
                <div className="w-full h-full bg-[rgba(0,0,0,0.2)] flex justify-center items-center">
                  <p className="text-3xl font-bold font-NPSfont leading-[180%] text-center text-white">
                    마음대로 바꾸는 <br /> 옛날 동화
                  </p>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="w-[400px] h-[270px] bg-main-point rounded-[50px]"></div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="w-[400px] h-[270px] bg-main-point rounded-[50px]"></div>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </div>
  );
}
