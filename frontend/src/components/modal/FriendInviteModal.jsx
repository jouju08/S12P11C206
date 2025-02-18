import { useActiveUser } from '@/store/activeStore';
import { useRoomStore, useTaleRoom } from '@/store/roomStore';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '@/styles/text.css';

export default function FriendInviteModal() {
  const {
    connectRoom,
    joinRoom,
    currentRoom,
    inviteFlag,
    setBaseTaleId,
    setInviteFlag,
    resetStateRoom,
  } = useTaleRoom();
  const { inviteInfo } = useActiveUser();
  const navigate = useNavigate();

  const handleAccpet = async () => {
    setInviteFlag(false);
    await connectRoom();
    const room = await joinRoom(inviteInfo.roomId, inviteInfo.to);

    setBaseTaleId(room?.baseTaleId);

    navigate('/tale/waiting');
  };

  const handleReject = async () => {
    await resetStateRoom();
  };

  useEffect(() => {

  }, [inviteFlag]);

  if (!inviteFlag) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400] flex flex-col text-center items-center">
        <h2 className="service-bold1">초대장</h2>
        <img src={inviteInfo.roomInfo.taleTitleImg}
        className='w-[140px] h-[100%] mx-auto mt-4 border-2 border-gray-300'
        alt='Host Profile'/>
        <p className="mt-4 text-gray-600 service-regular3">제목: {inviteInfo.roomInfo.taleTitle}</p>
        <p className="my-2 text-gray-600 service-regular3"><span className='text-main-carrot'>{inviteInfo.nickname}</span>님이 초대했어요!</p>
        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={() => handleAccpet()}
            className="w-[190px] h-[56px] bg-main-success rounded-[50px] flex items-center justify-center text-[20px] text-text-first
            service-regular2 hover:bg-green-500 transition-all duration-200">
            같이 만들기
          </button>

          <button
            onClick={() => handleReject()}
            className="w-[190px] h-[56px] bg-main-choose rounded-[50px]  flex items-center justify-center text-[20px] text-text-first
             service-regular2 hover:bg-red-500 transition-all duration-200">
            다음에 하기
          </button>
        </div>
      </div>
    </div>
  );
}
