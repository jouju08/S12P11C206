import React from 'react';
import { useState } from 'react';
import ChooseTale from '@/components/Room/ChooseTale';
import NumSearch from '@/components/Room/NumSearch';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
// import required modules
import { Navigation } from 'swiper/modules';

import '@/styles/roomPage.css';

export default function Room() {
  const [swiper, setSwiper] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // 클릭된 동화 업데이트
  const handleClick = (index) => {
    setSelectedIndex((prevIndex) => (prevIndex === index ? null : index));
    // 세터함수로 selectedIndex
  };

  // 검색어를 받아서 부모 상태 업데이트
  // ref를 써야하나 고민해보자
  const handleSearch = (query) => {
    setSearchQuery(query);
    console.log('부모 컴포넌트가 받은 검색어:', query);
  };

  return (
    <div className="w-[1024px] px-[25px]">
      <h1 className="text-center text-first service-accent1 mx-auto mb-3">
        동화 만들기
      </h1>
      {/* 방 번호 입력해서 시작 */}
      <div className="flex justify-end pr-[85px]">
        <NumSearch onSearch={handleSearch} />
      </div>

      <div className="flex justify-between items-center gap-8 py-8">
        <button
          onClick={() => swiper.slidePrev()}
          className="block w-[50px] h-[50px] bg-gray-50 rounded-full after:content-[url(/Room/room-navigater.png)]"></button>
        <Swiper
          slidesPerView={4}
          spaceBetween={80}
          grabCursor={true}
          navigation={true}
          modules={[Navigation]}
          onBeforeInit={(swipper) => setSwiper(swipper)}
          className="mySwiper w-[808px] h-[270px] overflow-hidden">
          {[...Array(6)].map((_, index) => (
            <SwiperSlide
              key={index}
              onClick={() => {
                handleClick(index);
              }}>
              <ChooseTale isActive={selectedIndex === index} />
            </SwiperSlide>
          ))}
        </Swiper>
        <button
          onClick={() => swiper.slideNext()}
          className="w-[50px] h-[50px] bg-gray-50 rounded-full -scale-x-100 after:content-[url(/Room/room-navigater.png)]"></button>
      </div>

      {/* 동화 선택에 따라 조건부 렌더링 */}
      <div>
        {selectedIndex === null ? (
          // 책 안 고름
          <div className="text-center">
            <div className="w-[974px] h-[270px] relative  overflow-hidden">
              <div className="left-[316px] top-[99px] absolute text-center text-gray-600 service-accent1">
                책을 먼저 골라볼까요?
              </div>
              <img
                className="w-[165px] h-[165px] left-[200px] top-[55px] absolute origin-top-left"
                src="/Room/room-reading.png"
              />
              <img
                className="w-[157px] h-[157px] left-[621px] top-[9px] absolute"
                src="/Room/room-book.png"
              />
            </div>
          </div>
        ) : (
          // 책 고름
          <div className="bg-green-300 p-4 w-64 text-center">
            2번 div (selectedIndex: {selectedIndex})
          </div>
        )}
      </div>
    </div>
  );
}
