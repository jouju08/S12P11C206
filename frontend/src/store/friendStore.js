import { create } from 'zustand';
import { shallow } from 'zustand/shallow';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import {
  getFriendRequests,
  answerFriendRequest,
  getFriendList,
  getDeleteFriend,
  getSendFriendRequests,
  getDeleteRequest,
  getAllMembers,
  postMakeFriend,
} from '@/apis/friend/friendAxios';
import { use } from 'react';

const initialState = {
  friendRequests: [],
  loading: false,
  error: null,
  friendList: [],
  sendFriendRequests: [],
  searchMembers: [],
};

const friendActions = (set, get) => ({
  // 친구 요청 목록 가져오기
  fetchFriendRequests: async () => {
    console.log('fetchFriendRequests 실행됨');
    set((state) => {
      state.loading = true;
      state.error = null;
    });

    try {
      const data = await getFriendRequests();

      set((state) => {
        console.log(Array.isArray(data.data));
        state.friendRequests = Array.isArray(data.data) ? [...data.data] : [];
        state.loading = false;
      });
    } catch (error) {
      set((state) => {
        state.error = error.message;
        console.log(' 서버에서 받은 친구 요청 데이터:', state.error);
        state.loading = false;
      });
    }
  },

  //보낸 요청
  fetchSendFriendRequests: async () => {
    console.log('fetchSendFriendRequests 실행됨');
    set((state) => {
      state.loading = true;
      state.error = null;
    });

    try {
      const data = await getSendFriendRequests();
      set((state) => {
        console.log(Array.isArray(data.data));
        state.sendFriendRequests = Array.isArray(data.data)
          ? [...data.data]
          : [];
        console.log('sendFriendRequests: ', state.sendFriendRequests);
        state.loading = false;
      });
    } catch (error) {
      set((state) => {
        state.error = error.message;
        console.log(' 서버에서 받은 친구 요청 데이터:', state.error);
        state.loading = false;
      });
    }
  },

  //보낸 요청 취소
  deleteRequest: async (ToLoginId) => {
    set((state) => {
      state.loading = true;
      state.error = null;
    });
    try {
      await getDeleteRequest(ToLoginId);
      await useFriendStore.getState().fetchSendFriendRequests();
      set((state) => {
        state.loading = false;
      });
    } catch (error) {
      set((state) => {
        state.error = error.message;
        console.log(' 에러 발생:', state.error);
        state.loading = false;
      });
    }
  },

  // 친구 요청 응답 처리 (수락 / 거절)
  // respondToRequest: async (fromLoginId, answer) => {
  //   set((state) => {
  //     state.loading = true;
  //     state.error = null;
  //   });
  //   try {
  //     await answerFriendRequest(fromLoginId, answer);
  //     await useFriendStore.getState().fetchFriendList();
  //     await useFriendStore.getState().fetchSendFriendRequests();
  //     set((state) => {
  //       state.loading = false;
  //     });
  //   } catch (error) {
  //     console.error(' Error responding to friend request:', error);
  //   }
  // },
  respondToRequest: async (fromLoginId, answer) => {
    set((state) => {
      state.loading = true;
      state.error = null;
    });
    try {
      await answerFriendRequest(fromLoginId, answer);
      set((state) => {
        // 현재 친구 요청 목록에서 응답한 요청을 제거
        state.friendRequests = state.friendRequests.filter(
          (request) => request.loginId !== fromLoginId
        );
        state.loading = false;
      });
      // 친구 목록과 보낸 요청 목록 업데이트
      await useFriendStore.getState().fetchFriendList();
      await useFriendStore.getState().fetchSendFriendRequests();
    } catch (error) {
      set((state) => {
        state.error = error.message;
        state.loading = false;
      });
      console.error('Error responding to friend request:', error);
    }
  },

  //친구 리스트
  fetchFriendList: async () => {
    set((state) => {
      state.loading = true;
      state.error = null;
    });

    try {
      const data = await getFriendList();

      set((state) => {
        console.log(Array.isArray(data.data));
        state.friendList = Array.isArray(data.data) ? data.data : [];
        state.loading = false;
      });
    } catch (error) {
      set((state) => {
        state.error = error.message;
        console.log(' 서버에서 받은 친구 데이터:', state.error);
        state.loading = false;
      });
    }
  },
  //친구 삭제
  deleteFriend: async (friendId) => {
    set((state) => {
      state.loading = true;
      state.error = null;
    });
    try {
      await getDeleteFriend(friendId);
      await useFriendStore.getState().fetchFriendList();
      set((state) => {
        state.loading = false;
      });
    } catch (error) {
      set((state) => {
        state.error = error.message;
        console.log(' 에러 발생:', state.error);
        state.loading = false;
      });
    }
  },

  //모든 멤버 불러오기
  fetchFindMembers: async () => {
    console.log('fetchFindMembers 실행됨');
    set((state) => {
      state.loading = true;
      state.error = null;
    });

    try {
      const data = await getAllMembers();
      set((state) => {
        console.log(Array.isArray(data.data));
        state.searchMembers = Array.isArray(data.data) ? [...data.data] : [];
        state.loading = false;
      });
    } catch (error) {
      set((state) => {
        state.error = error.message;
        console.log(' 서버에서 받은 멤버버 데이터:', state.error);
        state.loading = false;
      });
    }
  },

  makeFriend: async (memberId) => {
    console.log('makeFriend 실행됨');
    set((state) => {
      state.loading = true;
      state.error = null;
    });

    try {
      const data = await postMakeFriend(memberId);
      await useFriendStore.getState().fetchFindMembers();
      await useFriendStore.getState().fetchSendFriendRequests();
      set((state) => {
        state.loading = false;
      });
    } catch (error) {
      set((state) => {
        state.error = error.message;
        console.log(' 에러 발생:', state.error);
        state.loading = false;
      });
    }
  },
});

const useFriendStore = create(
  devtools(
    immer((set, get) => ({
      ...initialState,
      ...friendActions(set, get),
      resetState: () => set(() => ({ ...initialState })),
    })),
    { name: 'friend-store' }
  )
);

export const useFriend = () => {
  const friendRequests = useFriendStore(
    (state) => state.friendRequests,
    shallow
  );
  const friendList = useFriendStore((state) => state.friendList, shallow);
  const loading = useFriendStore((state) => state.loading);
  const error = useFriendStore((state) => state.error);
  const sendFriendRequests = useFriendStore(
    (state) => state.sendFriendRequests,
    shallow
  );
  const searchMembers = useFriendStore((state) => state.searchMembers, shallow);
  const stompClient = useFriendStore((state) => state.stompClient);

  const fetchFriendRequests = useFriendStore(
    (state) => state.fetchFriendRequests
  );
  const fetchFriendList = useFriendStore((state) => state.fetchFriendList);
  const deleteFriend = useFriendStore((state) => state.deleteFriend);
  const respondToRequest = useFriendStore((state) => state.respondToRequest);
  const fetchSendFriendRequests = useFriendStore(
    (state) => state.fetchSendFriendRequests
  );
  const deleteRequest = useFriendStore((state) => state.deleteRequest);
  const fetchFindFriends = useFriendStore((state) => state.fetchFindFriends);
  const fetchFindMembers = useFriendStore((state) => state.fetchFindMembers);
  const makeFriend = useFriendStore((state) => state.makeFriend);

  const connect = useFriendStore((state) => state.connect);
  const subscribeMain = useFriendStore((state) => state.subscribeMain);

  return {
    friendRequests,
    friendList,
    loading,
    error,
    sendFriendRequests,
    searchMembers,
    stompClient,

    fetchFriendRequests,
    fetchFriendList,
    deleteFriend,
    respondToRequest,
    fetchSendFriendRequests,
    deleteRequest,
    fetchFindFriends,
    fetchFindMembers,
    makeFriend,

    connect,
    subscribeMain,
  };
};
