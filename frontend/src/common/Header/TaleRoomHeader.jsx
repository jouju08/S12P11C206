import React, { useEffect, useState } from 'react';
import { useRoomStore, useTaleRoom } from '@/store/roomStore';
import { api } from '@/store/userStore';
import { useViduHook } from '@/store/tale/viduStore';
import { useTalePlay } from '@/store/tale/playStore';
import { useNavigate } from 'react-router-dom';

export default function TaleRoomHeader({ onClose }) {
  const { baseTaleId, taleTitle, leaveRoom } = useTaleRoom();
  const { leaveViduRoom } = useViduHook();
  const { resetState } = useTalePlay();

  // const navigate = useNavigate();

  // useEffect(() => {
  //   const fetchTaleTitle = async () => {
  //     const response = await api.get(`/base-tale/${baseTaleId || 1}`);

  //     if (response.data.status == 'SER') {
  //       leaveRoom();
  //       leaveViduRoom();
  //       resetState();

  //       // navigate('/room');
  //     } else if (response.data.status == 'SU') {
  //       setTaleTitle(response.data.data.title);
  //     }
  //   };
  //   fetchTaleTitle();
  // }, []);

  return (
    <header className="w-dvw bg-main-background shadow-md top-0 z-50">
      <nav className="w-[1024px] h-[100px] px-[20px] flex flex-row justify-between mx-auto items-center">
        <div className="w-[141px] h-[70px]">
          <img
            src="/Common/logo-blue.png"
            alt="로고"
            className="h-[70px]"
          />
        </div>
        {/* 책 이름 가져오기 */}
        <div className="text-text-first service-accent1">{taleTitle}</div>
        {/* <div
          onClick={onClose}
          className="bg-red-400 w-[160px] h-[70px]">
          나가기
        </div> */}
        <CloseBtn onClose={onClose} />
      </nav>
    </header>
  );
}

const CloseBtn = ({ onClose }) => {
  // const [showModal, setShowModal] = useState(false);
  // const navigate = useNavigate();
  // const location = useLocation();

  // const handleExit = () => {
  //   setShowModal(true);
  // };

  // const handleConfirm = () => {
  //   navigate('/room'); // 특정 페이지로 이동
  // };

  // const handleCancel = () => {
  //   setShowModal(false);
  // };

  return (
    <button
      onClick={onClose}
      className="h-[70px] pl-3 pr-5 bg-main-choose rounded-[100px] justify-center items-center inline-flex overflow-hidden">
      {/* <div
        className="w-[50px] h-[50px] relative overflow-hidden"
        style={{
          backgroundImage: "url('/Common/close.png')",
        }}
      /> */}
      <img
        src="/Common/close.png"
        alt="나가기"
        className="w-[40px] h-[40px]"
      />
      <div className="text-white service-bold1 h-full leading-[70px]">
        나가기
      </div>
    </button>
  );
};
