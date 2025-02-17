import React, { useEffect } from 'react';
import TaleRoomHeader from '@/common/Header/TaleRoomHeader';

// sweetAlert2 with react
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useTaleRoom } from '@/store/roomStore';
import { useNavigate } from 'react-router-dom';

export default function RoomBtn({ isSingle, location, children }) {
  // 동화방 click 이벤트 발생 시, 모달 띄움

  const {
    connectRoom,
    createRoom,
    setCurrentRoom,
    setIsSingle,
    setBaseTaleId,
  } = useTaleRoom();

  // const showGameModal = () => {
  //   setIsSingle(isSingle);
  //   const iframeSrc = isSingle === true ? '/tale/taleStart' : '/tale/lobby';

  //   withReactContent(Swal).fire({
  //     // html: <MyComponent />, // 여기에 jsx 컴포넌트 가능
  //     title: <TaleRoomHeader onClose={() => withReactContent(Swal).close()} />,
  //     html: (
  //       <iframe
  //         src={iframeSrc}
  //         className="w-full h-[768px]"
  //       />
  //     ), // 여기에 jsx 컴포넌트 가능
  //     showConfirmButton: false,
  //     allowOutsideClick: false,
  //     customClass: {
  //       popup: 'h-[768px] w-[1024px]',
  //     },
  //     animation: false,
  //   });
  // };

  const navigate = useNavigate();

  //싱글모드 여부
  const SingleTalePlay = () => {
    setIsSingle(isSingle);
    navigate('/tale/taleStart');
  };

  //멀티 방 만들기
  const multiTalePlay = async () => {
    setIsSingle(isSingle);
    await connectRoom();

    await createRoom();

    navigate('/tale/waiting');
  };

  const handleRoom = async () => {};

  return (
    <div
      onClick={() => (isSingle ? SingleTalePlay() : multiTalePlay())}
      className="cursor-pointer h-[45px] px-3 py-1 bg-main-btn rounded-[50px] border border-gray-200 justify-center items-center gap-1.5 inline-flex overflow-hidden hover:bg-main-carrot transition-all ease-linear">
      <div className="w-8 h-8 bg-white/50 rounded-[50px]">
        <img
          src={`Room/${location}`}
          alt="버튼 이미지"
        />
      </div>
      <div className="text-text-first service-bold3">{children}</div>
    </div>
  );
}
