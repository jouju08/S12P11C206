/**
 * author : Jung Juha (jouju08)
 * data : 2025.02.18
 * description : 친구 API
 * React -> SpringBoot
 */

import { api } from '@/store/userStore';

export const getFriendRequests = async () => {

  try {
    const response = await api.get('/friend/request');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 친구 요청 응답 (수락 또는 거절)
export const answerFriendRequest = async (fromLoginId, answer) => {
  try {
    const response = await api.get(`/friend/request/${answer}/${fromLoginId}`, {
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getFriendList = async () => {
  try {
    const response = await api.get(`/friend/info`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getDeleteFriend = async (friendId) => {
  try {
    const response = await api.get(`/friend/delete/${friendId}`, {
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getDeleteRequest = async (ToLoginId) => {
  try {
    const response = await api.get(`/friend/request/cancel/${ToLoginId}`, {
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getSendFriendRequests = async () => {

  try {
    const response = await api.get('/friend/request/send');

    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getAllMembers = async () => {

  try {
    const response = await api.get('/member/all');

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const postMakeFriend = async (memberId) => {

  try {
    const response = await api.post(`friend/request`, {
      receiverLoginId: memberId,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
