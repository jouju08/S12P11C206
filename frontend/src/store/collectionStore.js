import { create } from 'zustand';
import { shallow } from 'zustand/shallow';
import { userStore, api } from './userStore';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

const taleStart = {
  title: 'title',
  startVoice: 'url',
  startImg: 'url',
  startScript: 'str',
};

const seeTaleId = 1;

const taleDetail = {
  orderNum: 1,
  memberId: 1,
  taleId: 1, // 동화 id (방 id)

  orginImg: 'url', // 손그림 이미지
  img: 'url', // AI가 그린 이미지
  voice: 'url', // 스크립트 읽는 동화 연기 voice, wav형식
  script: 'str', // 동화내용
};

const initialState = {
  memberId: userStore.getState().memberId,
  accessToken: userStore.getState().accessToken,
  myTaleList: [],
  taleStart: { ...taleStart },
  seeTaleId,
  taleDetail: { ...taleDetail },
};

const collectionActions = (set, get) => ({
  setMyTaleList: async () => {
    try {
      // 내가 참여한 동화 목록 불러오는 api
      const response = await api.get('/tale/my-tale');
      console.log('📚 내가 참여한 동화 목록', response);

      // 응답 유효성 체크 추가
      if (!response || !response.data) {
        throw new Error('API 응답 오류');
      }

      // 값 어떻게 넘어오는지 확인 하고
      const taleList = response.data;
      set((state) => {
        state.myTaleList = taleList;
      });
    } catch (error) {
      console.error('❌ 동화 목록 불러오기 실패:', error);

      // 오류 상태 처리
      set((state) => {
        state.myTaleList = [];
      });
    }
  },

  setTaleStart: async (baseTaleId) => {
    try {
      const response = await api.get(`/base-tale/${baseTaleId}`);
      console.log('모달에 basetaleID는 ', baseTaleId);
      console.log('동화 초입부 불러오기!: ', response);

      const { title, startVoice, startImg, startScript } = response.data.data;

      set((state) => {
        state.taleStart = {
          title,
          startVoice,
          startImg,
          startScript,
        };
      });
    } catch (error) {
      console.log('동화 초입부 불러오기 실패: ', error);
    }
  },

  setSeeTaleId: (taleId) => {
    set((state) => {
      state.seeTaleId = taleId;
    });
  },

  setTaleDetail: async (pageNum) => {
    const response = await api.get(`/tale/${get().seeTaleId}/${pageNum - 1}`); // 0번째 페이지 호출인데 값이 1 들어옵니다
    console.log(
      `${get().seeTaleId}번째 동화 ${get().taleStart['title']}의 ${pageNum - 1} idx 페이지 불러오기: `,
      response
    );

    set((state) => {
      state.taleDetail = response.data.data;
    });
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
  const taleStart = useCollectionStore((state) => state.taleStart, shallow);
  const seeTaleId = useCollectionStore((state) => state.seeTaleId);
  const taleDetail = useCollectionStore((state) => state.taleDetail, shallow);

  const setMyTaleList = useCollectionStore((state) => state.setMyTaleList);
  const setTaleStart = useCollectionStore((state) => state.setTaleStart);
  const setSeeTaleId = useCollectionStore((state) => state.setSeeTaleId);
  const setTaleDetail = useCollectionStore((state) => state.setTaleDetail);

  return {
    memberId,
    myTaleList,
    taleStart,
    seeTaleId,
    taleDetail,

    setMyTaleList,
    setTaleStart,
    setSeeTaleId,
    setTaleDetail,
  };
};
