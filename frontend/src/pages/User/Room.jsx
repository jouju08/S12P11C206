import React, { useRef } from 'react';
import { useState, useEffect } from 'react';
import ChooseTale from '@/components/Room/ChooseTale';
import NumSearch from '@/components/Room/NumSearch';
import RoomBtn from '@/components/Room/RoomBtn';
import FairyTaleRoom from '@/components/Common/FairyTaleRoom';
import { Loading } from '@/common/Loading';
import { api } from '@/store/userStore';

import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';

import { Navigation } from 'swiper/modules';

import '@/styles/roomPage.css';
import taleAPI from '@/apis/tale/taleAxios';
import { useTaleRoom } from '@/store/roomStore';

/*
>> 방 번호 입력시 그 번호에 해당되는 부분 아직 안 됨<<
*/

export default function Room() {
  const [swiper, setSwiper] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [existTaleRoom, setExistTaleRoom] = useState([]); // 생성되있는 방들
  const [taleList, setTaleList] = useState([]); // BaseTale List
  const [loading, setLoading] = useState(false); // 로딩 상태

  const isMounted = useRef(true);

  const { setBaseTaleId } = useTaleRoom();

  // 클릭된 동화 업데이트
  const handleClick = async (index) => {
    setBaseTaleId(taleList[index].id);
    setSelectedIndex((prevIndex) => (prevIndex === index ? null : index));
    // 세터함수로 selectedIndex
  };

  // 검색어를 받아서 부모 상태 업데이트
  const handleSearch = async (query) => {
    setSearchQuery(query);
    setLoading(true);


    try {
      const SearchList = await taleAPI.getSearchTaleRooms(Number(query));
      const SearchTale = SearchList.data.data;


      setExistTaleRoom(
        SearchTale
          ? [
              <FairyTaleRoom
                key={SearchTale.id || 1}
                item={SearchTale}
              />,
            ]
          : []
      );
      setSelectedIndex(SearchTale?.['baseTaleId'] - 1);
    } catch (error) {
      setExistTaleRoom([]);
    } finally {
      setLoading(false);
    }
  };

  // selectedIndex 변경될 때마다 데이터 요청
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const roomList = await taleAPI.getAllTaleRooms();

        //선택한 baseTaleId에 맞게 필터
        const existTales = roomList.data['data'];

        const filterTales = existTales?.filter(
          (item) => item?.['baseTaleId'] == taleList[selectedIndex].id
        );

        setExistTaleRoom(
          filterTales?.map((item, idx) => (
            <FairyTaleRoom
              key={idx}
              item={item}
            />
          ))
        );
      } catch (error) {
        return error;
      } finally {
        setLoading(false);
      }
    };

    if (isMounted.current) {
      isMounted.current = false;
    } else {
      fetchData();
    }
  }, [selectedIndex]); // selectedIndex 변경 시마다 실행

  // 동화책 목록 불러오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/base-tale/list');
        setTaleList(response.data.data || []);
      } catch (err) {
        setTaleList([]); // 에러 발생 시 빈 배열 설정
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);



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
        <div className="flex justify-center">
          <Swiper
            onSlideChangeTransitionEnd={handleClick}
            slidesPerView={3}
            spaceBetween={-80}
            slidesOffsetAfter={-110}
            grabCursor={true}
            navigation={true}
            modules={[Navigation]}
            onBeforeInit={(swipper) => setSwiper(swipper)}
            centerInsufficientSlides={true}
            className="mySwiper w-[808px] h-[270px] overflow-hidden">
            {taleList.map((item, index) => (
              <SwiperSlide
                key={index}
                className="cursor-pointer"
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
        </div>
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
                {taleList[selectedIndex].title}
              </span>{' '}
              을(를) 골랐어요!
            </div>
            <div className="px-[20px] flex gap-4 justify-end">
              <RoomBtn
                isSingle={true}
                location={'alone.png'}>
                나 혼자 시작하기
              </RoomBtn>
              <RoomBtn
                isSingle={false}
                location={'together.png'}>
                친구들과 시작하기
              </RoomBtn>
            </div>

            {/* 데이터 표시 구간 */}
            <section className="w-full px-9 py-10">
              {loading ? (
                // <p>로딩 중...</p>
                <Loading />
              ) : existTaleRoom && existTaleRoom.length > 0 ? (
                <div>
                  <div className="grid grid-flow-row grid-cols-3 gap-4">
                    {...existTaleRoom}
                  </div>
                </div>
              ) : (
                <div className="w-full h-[300px] flex flex-col justify-center items-center">
                  <img
                    src="/Common/nodata.png"
                    alt="No Data"
                    className="w-[100px] h-[100px]"
                  />
                  <p className="service-accent2 text-text-first mt-2">
                    아직 만들어진{' '}
                    <span className="text-main-carrot">
                      {taleList[selectedIndex].title}
                    </span>{' '}
                    방이 없어요
                  </p>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
