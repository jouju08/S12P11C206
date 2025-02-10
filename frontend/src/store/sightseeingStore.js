import { create } from 'zustand';
import { shallow } from 'zustand/shallow';
import { userStore, api } from './userStore';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

const initialState = {
  drawingList: [],
  memberId: userStore.getState().memberId,
  sortBy: 'LATEST', // 초기값: 최신순("date")
};

const sightseeingActions = (set, get) => ({
  setDrawingList: async () => {
    try {
      const response = await api.get('/gallery', {
        params: { order: get().sortBy },
      });

      // 응답 데이터가 정상이면 drawingList 업데이트
      if (response.data && response.data.status === 'SU') {
        console.log('✅ 갤러리 목록 불러오기 성공', response);

        set((state) => {
          state.drawingList = response.data.data;
        });
      } else {
        throw new Error('API 응답 오류');
      }
    } catch (error) {
      console.error('❌ drawingList 불러오기 실패:', error);
      set((state) => {
        state.drawingList = [];
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
  const sortBy = useSightseeingStore((state) => state.sortBy);

  const setDrawingList = useSightseeingStore((state) => state.setDrawingList);
  const setSortBy = useSightseeingStore((state) => state.setSortBy);

  return {
    memberId,
    drawingList,
    sortBy,

    setDrawingList,
    setSortBy,
  };
};
