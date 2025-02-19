/**
 * author : Lim Chaehyeon (chaehyeon)
 * data : 2025.02.18
 * description : 헤더
 * React
 */

import { useUser } from '@/store/userStore';
import{useFriend} from '@/store/friendStore';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function DefaultHeader({ showFriend, setShowFriend }) {
  const { logout } = useUser();
  const {friendRequests,fetchFriendRequests}=useFriend();
  useEffect(()=>{
    fetchFriendRequests();
  },[]);
  return (
    <header>
      <div className="w-[1024px] h-[100px] relative m-auto">
        {/* logo */}
        <Link
          to="/main"
          className="w-[141px] h-[70px] left-[120px] top-1/2 -translate-x-1/2 -translate-y-1/2 absolute">
          <img
            src="/Common/logo-blue.png"
            alt="로고"
            className="h-[70px]"
          />
        </Link>

        <div className=" left-[810px] top-[35px] absolute service-bold3 text-first cursor-pointer hover:text-main-choose">
          {friendRequests.length!=0&&(
            <p className='rounded-full font-NPSfont bg-main-carrot px-2 py-[3px] text-xs absolute top-[-18px] right-[0px]  text-text-white'>
              {friendRequests.length}
            </p>  
            )
          }
          <button onClick={() => setShowFriend(!showFriend)}> 친구목록</button>
        </div>
        <div className=" left-[900px] top-[35px] absolute service-bold3 text-first cursor-pointer hover:text-main-choose">
          <button onClick={logout}> 그만하기</button>
        </div>
      </div>
    </header>
  );
}
