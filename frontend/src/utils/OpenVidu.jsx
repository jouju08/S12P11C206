import React from 'react';
import { api } from '@/store/userStore';
import { useTalePlay } from '@/store/tale/playStore';

export default function OpenVidu() {
  const { roomId } = useTalePlay();

  //SpringBoot로 OpenVidu Token 요청
  async function getToken() {
    const response = await api.get('/tale/room/token', {
      params: {
        roomId: roomId,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to get token: ${error.errorMessage}`);
    }

    const data = await response.json();
    console.log(data.token);
    return data.token;
  }
  return <div>OpenVidu</div>;
}
