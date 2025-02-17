import { useActiveUser } from '@/store/activeStore';
import { useRoomStore, useTaleRoom } from '@/store/roomStore';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
    console.log(inviteFlag);
  }, [inviteFlag]);

  if (!inviteFlag) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
        <h2 className="service-bold1">같이 {inviteInfo.roomInfo.taleTitle} 만들래?</h2>
        <img src={inviteInfo.roomInfo.hostProfileImg}
        className='w-20 h-20 rounded-full'
        alt='Host Profile'/>
        <p className="my-4 text-gray-600">{inviteInfo.nickname}님이 초대했어요!</p>
        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={() => handleAccpet()}
            className="w-[195px] h-[56px] bg-main-success rounded-[50px] flex items-center justify-center text-[20px] text-text-first
            service-regular2 hover:bg-green-500 transition-all duration-200">
            같이 만들기
          </button>

          <button
            onClick={() => handleReject()}
            className="w-[195px] h-[56px] bg-main-choose rounded-[50px]  flex items-center justify-center text-[20px] text-text-first
             service-regular2 hover:bg-red-500 transition-all duration-200">
            다음에 하기
          </button>
        </div>
      </div>
    </div>
  );
}
