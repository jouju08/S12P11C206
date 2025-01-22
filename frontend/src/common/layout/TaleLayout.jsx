import React from 'react';
import { Outlet } from 'react-router-dom';

export default function TaleLayout() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
