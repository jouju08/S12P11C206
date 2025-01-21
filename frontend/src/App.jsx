import React, { useEffect, useState } from 'react';
import Login from './pages/User/Login';
import AppRouter from './routes/AppRouter';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

export default function App() {
  return (
    <div className="App">
      <AppRouter />
    </div>
  );
}
