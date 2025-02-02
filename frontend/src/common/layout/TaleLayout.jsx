import React from 'react';
import { Outlet } from 'react-router-dom';
import TaleRoomHeader from '../Header/TaleRoomHeader';

export default function TaleLayout() {
  return (
    <div>
      <TaleRoomHeader />
      <Outlet />
    </div>
  );
}
