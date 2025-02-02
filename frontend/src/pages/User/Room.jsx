import React from 'react';
import { useState, useEffect } from 'react';
import ChooseTale from '@/components/Room/ChooseTale';
import NumSearch from '@/components/Room/NumSearch';
import RoomBtn from '@/components/Room/RoomBtn';
import FairyTaleRoom from '@/components/Common/FairyTaleRoom';
import axios from 'axios';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
// import required modules
import { Navigation } from 'swiper/modules';

import '@/styles/roomPage.css';

/*
>> 방 번호 입력시 그 번호에 해당되는 부분 아직 안 됨<<
*/

// 확인용 더미데이터
const taleArray = [
  '아기 돼지 삼형제',
  '백설공주',
  '신데렐라',
  '피리부는 사나이',
  '흥부놀부',
  '피노키오',
];

export default function Room() {
  const [swiper, setSwiper] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState([]); // 백엔드에서 가져올 데이터
  const [taleList, setTaleList] = useState([]); // 백엔드에서 가져올 데이터
  const [loading, setLoading] = useState(false); // 로딩 상태

  // 클릭된 동화 업데이트
  const handleClick = (index) => {
    setSelectedIndex((prevIndex) => (prevIndex === index ? null : index));
    // 세터함수로 selectedIndex
  };

  // 검색어를 받아서 부모 상태 업데이트
  const handleSearch = (query) => {
    setSearchQuery(query);
    console.log('부모 컴포넌트가 받은 검색어:', query);
  };

  // selectedIndex 변경될 때마다 데이터 요청
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 아래 api 주소는 동화 상세 정보 조회, 다른 것 필요
        // const response = await axios.get(`/api/tale/${selectedIndex}`);
        // console.log('➡️ 가져온 데이터 : ', response.data);

        // 테스트용 dummy data
        const dummy = {
          hostMemberId: 0,
          hostNickname: '방장이겠지',
          hostProfileImg: null,
          maxParticipantsCnt: 4,
          participantsCnt: 1,
          roomId: 222,
          taleTitle: taleList[selectedIndex].title,
        };
        setData(
          new Array(Number(selectedIndex)).fill(dummy).map((item, idx) => (
            <FairyTaleRoom
              key={idx}
              item={item}
            />
          ))
        );

        console.log(`${taleList[selectedIndex].title} 변경!`);
      } catch (error) {
        console.error('➡️ 데이터 가져오기 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedIndex]); // selectedIndex 변경 시마다 실행

  // 동화책 목록 불러오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/tale/list');
        console.log('✅ 가져온 데이터', response.data);
        // 응답 데이터 구조 확인 후 배열 접근
        setTaleList(response.data.data || []);
      } catch (err) {
        console.error('✅ 데이터 가져오기 실패:', err);
        setTaleList([]); // 에러 발생 시 빈 배열 설정
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // 빈 배열: 컴포넌트 마운트 시 1회만 실행

  return (
    <div className="w-[1024px] px-[25px]">
      <h1 className="text-center text-text-first service-accent1 mx-auto mb-3">
        동화 만들기
      </h1>
      {/* 방 번호 입력해서 시작 */}
      <div className="flex justify-end pr-[85px]">
        <NumSearch onSearch={handleSearch} />
      </div>

      {/* 동화목록 swiper */}
      <div className="flex justify-between items-center gap-8 py-8">
        <button
          onClick={() => swiper.slidePrev()}
          className="block w-[50px] h-[50px] bg-gray-50 rounded-full after:content-[url(/Room/room-navigater.png)]"></button>
        <Swiper
          slidesPerView={3}
          spaceBetween={-80}
          grabCursor={true}
          navigation={true}
          modules={[Navigation]}
          onBeforeInit={(swipper) => setSwiper(swipper)}
          className="mySwiper w-[808px] h-[270px] overflow-hidden">
          {taleList.map((item, index) => (
            <SwiperSlide
              key={index}
              onClick={() => {
                handleClick(index);
              }}>
              <ChooseTale
                item={item}
                isActive={selectedIndex === index}
              />
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
          <>
            <div className="w-full h-[100px] leading-[100px] text-center service-accent1 text-text-second">
              <span className="text-main-choose">
                {taleArray[selectedIndex]}
              </span>{' '}
              을(를) 골랐어요!
            </div>
            <div className="px-[20px] flex gap-4 justify-end">
              <RoomBtn
                numOfPerson={1}
                location={'alone.png'}>
                나 혼자 시작하기
              </RoomBtn>
              <RoomBtn
                numOfPerson={4}
                location={'together.png'}>
                내가 방 만들기
              </RoomBtn>
            </div>
            {/* 데이터 표시 구간 */}
            <section className="w-full px-9 py-10">
              {loading ? (
                <p>로딩 중...</p>
              ) : data ? (
                <div>
                  <h2 className="text-xl font-bold">
                    데이터 ID: {selectedIndex}
                  </h2>
                  <div className="grid grid-flow-row grid-cols-3 gap-4">
                    {...data}
                  </div>
                </div>
              ) : (
                <p>데이터 없음</p>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
