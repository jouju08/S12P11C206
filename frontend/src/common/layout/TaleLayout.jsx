import React from 'react';
import { Outlet } from 'react-router-dom';
import { useUser } from '@/store/userStore';
import TaleRoomHeader from '../Header/TaleRoomHeader';

export default function TaleLayout() {
  const { isAuthenticated } = useUser();
  return (
    <div className="flex flex-col justify-center h-full w-full">
      <div className="flex flex-col w-[1024px] h-[768px] justify-center items-center">
        {isAuthenticated ? <TaleRoomHeader /> : null}
        <Outlet />
      </div>
    </div>
  );
}
