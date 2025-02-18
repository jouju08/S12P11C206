/**
 * author : Lim Chaehyeon (chaehyeon)
 * data : 2025.02.18
 * description : 친구 소켓
 * React
 */

import React, { useEffect } from 'react';
import { useActiveUser } from '@/store/activeStore';
import { useUser } from '@/store/userStore';
import { useTaleRoom } from '@/store/roomStore';
import { useNavigate } from 'react-router-dom';

export const useFriendSocket = () => {
  const { isAuthenticated } = useUser();
  const { connect, subscribeMain, disconnect } = useActiveUser();
  const { connectRoom, inviteFlag, resetStateRoom } = useTaleRoom();
  const navigate = useNavigate();

  useEffect(() => {
    let stompClient;

    const initializeSocket = async () => {
      if (isAuthenticated) {
        stompClient = await connect();
        subscribeMain();
      }
    };

    initializeSocket();

    return () => {
      if (stompClient) {
        disconnect();
      }
    };
  }, [isAuthenticated, connect, subscribeMain, disconnect]);
};
