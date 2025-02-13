import React, { useEffect, useState } from 'react';
import Login from './pages/User/Login';
import AppRouter from './routes/AppRouter';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { useUser } from './store/userStore';
import { useNavigate } from 'react-router-dom';
import { useFriendSocket } from './hooks/useFriendSocket';

export default function App() {
  useFriendSocket();

  return (
    <div className="App">
      <AppRouter />
    </div>
  );
}
