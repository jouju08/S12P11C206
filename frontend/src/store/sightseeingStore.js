import { create } from 'zustand';
import { shallow } from 'zustand/shallow';
import { userStore, api } from './userStore';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

const initialState = {
  drawingList: [],
  popList: [],
  memberId: userStore.getState().memberId,
  sortBy: 'LATEST', // 초기값: 최신순("date")
  currentPage: 1,
  hasOrigin: false,
};

const sightseeingActions = (set, get) => ({
  loadMoreDrawings: async () => {
    const currentPage = get().currentPage;
    const sortBy = get().sortBy;

    try {
      const response = await api.get('/gallery', {
        params: { order: sortBy, page: currentPage + 1, hasOrigin: get().hasOrigin },
      });


      if (response.data && response.data.status === 'SU') {
        set((state) => {
          state.drawingList = [...state.drawingList, ...response.data.data];
          state.currentPage = currentPage + 1;
        });
        return true; // 더 많은 데이터가 있음을 나타냄
      } else if (response.data && response.data.status === 'NP') {

        return false; // 더 이상 데이터가 없음을 나타냄
      } else {
        throw new Error('API 응답 오류');
      }
    } catch (error) {
      return false;
    }
  },

  // setDrawingList 액션 수정
  setDrawingList: async () => {
    try {
      const response = await api.get('/gallery', {
        params: { order: get().sortBy, page: 1, hasOrigin: get().hasOrigin },
      });

      if (response.data && response.data.status === 'SU') {

        set((state) => {
          state.drawingList = response.data.data;
          state.currentPage = 1; // 페이지 초기화
        });
      } else {
        throw new Error('API 응답 오류');
      }
    } catch (error) {

      set((state) => {
        state.drawingList = [];
        state.currentPage = 1;
      });
    }
  },

  // sortBy 상태를 변경하고, 변경 후 새 데이터를 다시 불러옴
  setSortBy: (newSortBy) => {
    set((state) => {
      state.sortBy = newSortBy;
    });
    // sortBy가 바뀌면 바로 새 데이터를 불러오도록 실행
    get().setDrawingList();
  },

  setPopList: async () => {
    try {
      const response = await api.get('/gallery', {
        params: { order: 'POP', page: 1, hasOrigin: get().hasOrigin },
      });

      if (response.data && response.data.status === 'SU') {


        set((state) => {
          state.popList = response.data.data.slice(0, 3);

        });
      } else {
        throw new Error('API 응답 오류');
      }
    } catch (error) {

      set((state) => {
        state.popList = [];
      });
    }
  },

  setHasOrigin: (newHasOrigin) => {
    set((state) => {
      state.hasOrigin = newHasOrigin;
    });
    
    get().setDrawingList();
    get().setPopList();
  },


});

const useSightseeingStore = create(
  devtools(
    immer((set, get) => ({
      ...initialState,
      ...sightseeingActions(set, get),
      resetState: () => set(() => ({ ...initialState })),
    }))
  )
);


export const useSightseeing = () => {
  const memberId = useSightseeingStore((state) => state.memberId);
  const drawingList = useSightseeingStore(
    (state) => state.drawingList,
    shallow
  );
  const popList = useSightseeingStore((state) => state.popList, shallow);
  const sortBy = useSightseeingStore((state) => state.sortBy);
  const currentPage = useSightseeingStore((state) => state.currentPage);
  const hasOrigin = useSightseeingStore((state) => state.hasOrigin);

  const loadMoreDrawings = useSightseeingStore(
    (state) => state.loadMoreDrawings
  );
  const setDrawingList = useSightseeingStore((state) => state.setDrawingList);
  const setPopList = useSightseeingStore((state) => state.setPopList);
  const setSortBy = useSightseeingStore((state) => state.setSortBy);
  const setHasOrigin = useSightseeingStore((state) => state.setHasOrigin);

  return {
    memberId,
    drawingList,
    popList,
    sortBy,
    currentPage,
    hasOrigin,

    setDrawingList,
    setPopList,
    setSortBy,
    loadMoreDrawings,
    setHasOrigin,
  };
};
