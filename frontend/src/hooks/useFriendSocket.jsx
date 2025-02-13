import React, { useEffect } from 'react';
import { useActiveUser } from '@/store/activeStore';
import { useUser } from '@/store/userStore';

export const useFriendSocket = () => {
  const { isAuthenticated } = useUser();
  const { connect, subscribeMain, disconnect } = useActiveUser();

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
