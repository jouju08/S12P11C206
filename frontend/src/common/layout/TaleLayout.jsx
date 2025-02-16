import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { userStore, useUser } from '@/store/userStore';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTalePlay } from '@/store/tale/playStore';

import TaleRoomHeader from '../Header/TaleRoomHeader';
import { useTaleRoom } from '@/store/roomStore';
import { useViduHook } from '@/store/tale/viduStore';
import { useNavigationBlocker } from '@/hooks/useNavigationBlocker';
import { current } from 'immer';

export default function TaleLayout() {
  const { isAuthenticated } = useUser();
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { currentRoom, leaveRoom, resetStateRoom } = useTaleRoom();
  const { roomId, resetState } = useTalePlay();
  const { leaveViduRoom } = useViduHook();

  const isStart = location.pathname === '/tale/taleStart';
  const isSentence = location.pathname === '/tale/taleSentenceDrawing';
  const isKeyword = location.pathname === '/tale/taleKeyword';
  const isHotTale = location.pathname === '/tale/hottale';

  const { showEscape, setShowEscape, handleConfirmExit, handleCancelExit } =
    useNavigationBlocker(); //탈주 감지

  // 나가기 버튼 누르면 모달을 띄워줌
  const handleExit = () => {
    setShowModal(true);
  };

  const handleConfirm = () => {
    //방 나가기전 초기화
    leaveRoom();
    leaveViduRoom();
    resetStateRoom();

    navigate('/room');
  };

  // 나가기를 취소함 -> 모달 hidden
  const handleCancel = () => {
    setShowModal(false);
  };

  useEffect(() => {
    if (!currentRoom) {
      leaveRoom();
      leaveViduRoom();
      resetStateRoom();
      resetState();

      navigate('/room');
    }
  }, [currentRoom]);

  return (
    <>
      <div className="flex flex-col justify-center h-full w-full">
        <div className="relative flex flex-col mx-auto w-dvw h-lvh justify-between items-center">
          {isSentence ? null : isAuthenticated ? (
            <TaleRoomHeader onClose={handleExit} />
          ) : null}

          {/* background option */}
          {isStart ? (
            <img
              src="/TaleStart/field-background.png"
              alt="TaleStart 배경"
              className="absolute bottom-0 left-0 w-svw h-svh object-cover bg-cover"
            />
          ) : null}
          {isHotTale ? (
            <img
              src="/TaleStart/field-background.png"
              alt="HotTale 배경"
              className="absolute bottom-0 left-0 w-svw h-svh object-cover bg-cover"
            />
          ) : null}
          {isKeyword ? (
            <img
              src="/TaleKeyword/field-background.png"
              alt="TaleKeyword 배경"
              className="absolute bottom-0 left-0 w-svw h-svh object-cover bg-cover opacity-80"
            />
          ) : null}
          {isSentence ? (
            <img
              src="/TaleSentenceDrawing/field-background1.png"
              alt="TaleSentenceDrawing 배경"
              className="absolute bottom-0 left-0 w-svw h-svh object-cover bg-cover opacity-50"
            />
          ) : null}

          <Outlet />
          {showModal && (
            <div className="absolute top-0 left-0 z-50 w-[1024px] h-full bg-[rgba(0,0,0,0.5)] flex justify-center items-center">
              <Modal
                handleConfirm={handleConfirm}
                handleCancel={handleCancel}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// 방 나가기 모달
const Modal = ({ handleConfirm, handleCancel }) => {
  return (
    <div className="w-[470px] h-[279px] bg-white rounded-[20px] shadow-[4px_4px_4px_0px_rgba(0,0,0,0.25)] border border-gray-200 flex-col justify-center items-start inline-flex overflow-hidden">
      {/* title */}
      <div className="self-stretch px-5 py-2.5 bg-main-point justify-between items-center inline-flex overflow-hidden">
        <div className="text-gray-500 service-bold1">나가기 확인</div>
        <button
          onClick={handleCancel}
          className="w-8 h-8 relative"
          style={{ backgroundImage: "url('/Common/black-close.png')" }}
        />
      </div>
      {/* 내용 */}
      <div className="w-[470px] h-[218px] relative flex justify-center items-center overflow-hidden">
        {/* 요정이미지 */}
        <img
          className="w-[159px] h-[159px] inline-block"
          src="/Common/sad-fairy.png"
        />
        <div className="w-[287px] h-[181px] relative overflow-hidden">
          {/* 말풍선 이미지 */}
          <div className="w-[287px] h-[116px] left-0 top-0 absolute justify-center items-center inline-flex">
            <img
              className="w-[287px] h-[116px]"
              src="/Common/fairy-chat-bubble.png"
            />
          </div>
          {/* 버튼 */}
          <div className="w-[287px] h-16 px-7 py-[7px] left-0 top-[117px] absolute justify-between items-center inline-flex">
            <button
              onClick={handleConfirm}
              className="w-[100px] h-[50px] py-2 bg-main-pink text-text-first service-regular2 rounded-[30px] text-center">
              예
            </button>
            <button
              onClick={handleCancel}
              className="w-[100px] h-[50px] py-2 text-text-first service-regular2 bg-main-strawberry rounded-[30px] text-center">
              아니요
            </button>
          </div>
          {/* 말풍선 말 */}
          <div className="pl-8 pr-[31px] left-[66px] top-[29px] absolute justify-center items-center inline-flex">
            <div className="text-center text-text-first text-xl font-bold font-NPSfont">
              정말 방에서
              <br />
              나갈까요?
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
