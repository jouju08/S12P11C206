import { create } from 'zustand';
import { shallow } from 'zustand/shallow';
import { userStore, api } from './userStore';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

const taleStart = {
  title: 'title',
  startVoice: 'url',
  startImg: 'url',
  startScript: 'store start str',
};

// const seeTaleId = 1;

const taleDetail = {
  orderNum: 1,
  memberId: 1,
  taleId: 1, // 동화 id (방 id)

  orginImg: 'url', // 손그림 이미지
  img: 'url', // AI가 그린 이미지
  voice: 'url', // 스크립트 읽는 동화 연기 voice, wav형식
  script: 'store detail str', // 동화내용
};

const initialState = {
  memberId: userStore.getState().memberId,
  accessToken: userStore.getState().accessToken,
  myTaleList: [],
  taleStart: { ...taleStart },
  seeTaleId: 1,
  taleDetail: { ...taleDetail },
  participants: [],
  tailTitleList: [],
  createdAt: '',
  // 동화 페이지, 내 동화 목록 불러오기
  sortBy: 'LATEST',
  currentPage: 0,
  filterBy: null,
};

const collectionActions = (set, get) => ({
  setMyTaleList: async () => {
    try {
      // 내가 참여한 동화 목록 불러오는 api
      const response = await api.get('/tale/my-tale', {
        params: { order: get().sortBy, baseTaleId: get().filterBy, page: 0 },
      });
      console.log('📚 내가 참여한 동화 목록', response);

      // 응답 유효성 체크 추가
      if (!response || !response.data) {
        throw new Error('API 응답 오류');
      }

      // 값 어떻게 넘어오는지 확인 하고
      const taleList = response.data.data;
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

      // [수정 2] Immer의 draft 사용 방식 변경
      set((state) => {
        state.taleStart.title = title;
        state.taleStart.startVoice = startVoice;
        state.taleStart.startImg = startImg;
        state.taleStart.startScript = startScript;
      });

      // set((state) => {
      //   state.taleStart = {
      //     title: response.data.data.title,
      //     startVoice: response.data.data.startVoice,
      //     startImg: response.data.data.startImg,
      //     startScript: response.data.data.startScript,
      //   };

      // });
      console.log('도입부 바꼈는지 확인', get().taleStart);
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
    //  0번째 페이지 -> basetale start 불러옴
    const response = await api.get(`/tale/${get().seeTaleId}/${pageNum}`);
    console.log(
      `${get().seeTaleId}번째 동화 ${get().taleStart['title']}의 ${pageNum} idx 페이지 불러오기: `,
      response
    );

    set((state) => {
      state.taleDetail = response.data.data;
    });
    console.log('디테일 바꼈는지 확인', get().taleDetail);
  },

  setTaleFinish: async () => {
    const response = await api.get(`/tale/${get().seeTaleId}`);
    console.log('마지막 부분', response);

    const { participants, createdAt } = response.data.data;

    const uniqueParticipants = participants.filter((element, index) => {
      return participants.indexOf(element) === index;
    });

    set((state) => {
      state.participants = uniqueParticipants;
      state.createdAt = createdAt;
    });
  },

  // sortBy 상태를 변경하고, 변경 후 새 데이터를 다시 불러옴
  setSortBy: (newSortBy) => {
    set((state) => {
      state.sortBy = newSortBy;
    });
    // sortBy가 바뀌면 바로 새 데이터를 불러오도록 실행
    get().setMyTaleList();
  },

  // filterBy 상태를 변경하고, 변경 후 새 데이터를 다시 불러옴
  setFilterBy: (newFilterBy) => {
    set((state) => {
      state.filterBy = newFilterBy;
    });
    // filterBy 바뀌면 바로 새 데이터를 불러오도록 실행
    get().setMyTaleList();
  },

  setTailTitleList: async () => {
    const response = await api.get('/base-tale/list');

    console.log('base 동화책들', response);
    const uniqueTitle = response.data.data.map((element, index) => ({
      title: element.title,
      baseTaleId: element.id,
    }));
    console.log('유닠', uniqueTitle);

    set((state) => {
      state.tailTitleList = uniqueTitle;
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
  const participants = useCollectionStore(
    (state) => state.participants,
    shallow
  );
  const tailTitleList = useCollectionStore(
    (state) => state.tailTitleList,
    shallow
  );
  const createdAt = useCollectionStore((state) => state.createdAt);
  const sortBy = useCollectionStore((state) => state.sortBy);
  const filterBy = useCollectionStore((state) => state.filterBy);
  const currentPage = useCollectionStore((state) => state.currentPage);

  const setMyTaleList = useCollectionStore((state) => state.setMyTaleList);
  const setTaleStart = useCollectionStore((state) => state.setTaleStart);
  const setSeeTaleId = useCollectionStore((state) => state.setSeeTaleId);
  const setTaleDetail = useCollectionStore((state) => state.setTaleDetail);
  const setTaleFinish = useCollectionStore((state) => state.setTaleFinish);
  const setFilterBy = useCollectionStore((state) => state.setFilterBy);
  const setSortBy = useCollectionStore((state) => state.setSortBy);
  const setTailTitleList = useCollectionStore(
    (state) => state.setTailTitleList
  );

  return {
    memberId,
    myTaleList,
    taleStart,
    seeTaleId,
    taleDetail,
    participants,
    createdAt,
    sortBy,
    filterBy,
    currentPage,
    tailTitleList,

    setMyTaleList,
    setTaleStart,
    setSeeTaleId,
    setTaleDetail,
    setTaleFinish,
    setTailTitleList,
    setSortBy,
    setFilterBy,
  };
};
