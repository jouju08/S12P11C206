import { create } from 'zustand';
import { shallow } from 'zustand/shallow';
import { userStore, api } from './userStore';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

const initialState = {
  memberId: userStore.getState().memberId,
  accessToken: userStore.getState().accessToken,
  myTaleList: [],
};

const collectionActions = (set, get) => ({
  setMyTaleList: async () => {
    try {
      // axios 기본 헤더에 토큰 추가
      //   api.defaults.headers.common['Authorization'] =
      //     `Bearer ${get().accessToken}`;

      // 내가 참여한 동화 목록 불러오는 api
      const response = await api.get('/tale/my-tale');
      console.log('📚 내가 참여한 동화 목록', response);
      // false 라면 axios 인터셉터 설정에서 state가 SU가 아닌 경우 false 리턴하게 해서 그럼
      // 백엔드 문제인 것 가타요ㅠㅠㅠㅠㅠㅠㅠㅠㅠ

      // 응답 유효성 체크 추가
      if (!response || !response.data) {
        throw new Error('API 응답 오류');
      }

      // 값 어떻게 넘어오는지 확인 하고
      // const taleList = response.data.data 일려나
      // set((state) => {
      //     state.myTaleList = taleList;
      // })

      console.log('✅ 동화 목록 불러오기 성공', response.data);
    } catch (error) {
      console.error('❌ 동화 목록 불러오기 실패:', error);
      // 오류 상태 처리
      set((state) => {
        state.myTaleList = [];
      });
    }
  },
});

const useCollectionStore = create(
  // Redux DevTools와 연동
  devtools(
    immer((set, get) => ({
      ...initialState,
      ...collectionActions(set, get),
      resetState: () => set(() => ({ ...initialState })),
    }))
  )
);

export const useCollection = () => {
  const memberId = useCollectionStore((state) => state.memberId);
  const myTaleList = useCollectionStore((state) => state.myTaleList, shallow);

  const setMyTaleList = useCollectionStore((state) => state.setMyTaleList);

  return {
    memberId,
    myTaleList,

    setMyTaleList,
  };
};
