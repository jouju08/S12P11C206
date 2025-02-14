import React, { useState, useEffect } from 'react';
import { useFriend } from '@/store/friendStore';
import { useActiveUser } from '@/store/activeStore';

const InviteModal = ({ handleExit }) => {
  const { friendList, fetchFriendList } = useFriend();
  const { inviteFriend } = useActiveUser();

  useEffect(() => {
    fetchFriendList();
  }, []);

  return (
    <div className="w-[40%] h-[80%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-y-auto bg-white rounded-2xl border border-[#9f9f9f] flex flex-col items-center">
      <div className="w-full h-[15%] px-4 relative overflow-hidden bg-main-background flex justify-between items-center shadow-lg z-10">
        <div className="text-text-first service-accent2">친구 초대</div>
        <button
          onClick={handleExit}
          className="w-16 h-16 relativ flex justify-center items-center">
          <img
            src="/Common/black-close.png"
            alt="닫기"
          />
        </button>
      </div>
      {friendList.length === 0 ? (
        <div className="relative w-full h-full flex flex-col justify-center items-center">
          <img
            className="w-50 h-50"
            src="/Main/main-fairy.png"
          />
          <p className="text-center text-lg text-text-first font-NPSfont">
            친구를 찾아볼까요?
          </p>
        </div>
      ) : (
        <ul className="w-full">
          {friendList.map((friend) => (
            <li
              key={friend.loginId}
              className="flex items-center justify-between w-full p-3 border-b border-[#e6e6e6]">
              <div className="flex items-center gap-3">
                <img
                  className="w-12 h-12 rounded-full"
                  src={friend.profilePic || '/Common/blank_profile.jpg'}
                  alt="profile"
                />

                <span className="text-text-first text-lg font-NPSfont">
                  {friend.nickname}
                </span>
              </div>
              {/* 접속중 상태 */}

              {friend.connecting ? (
                <>
                  <div>
                    <span className="text-text-second relative service-regular3 aftrer:content-[''] after:absolute after:w-full after:h-[5px] after:bottom-[-7px] after:left-0 after:bg-main-success">
                      들어와 있어 !
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => inviteFriend(friend.memberId)}
                      className="px-4 py-2 bg-main-success text-text-white rounded-lg hover:bg-green-600 transition-colors duration-200 font-NPSfont ">
                      같이 만들기
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <span className="text-text-second relative service-regular3 aftrer:content-[''] after:absolute after:w-full after:h-[5px] after:bottom-[-7px] after:left-0 after:bg-main-choose">
                      다음에 놀자 ~
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-main-choose text-text-white rounded-lg font-NPSfont ">
                      다음에 놀기
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default InviteModal;
