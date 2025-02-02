import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { shallow } from 'zustand/shallow';
import taleAPI from '@/apis/tale/taleAxios';
import { userStore } from '../userStore';

//기본 동화 정보
const tale = {
  taleTitle: 'title',
  taleStartScript: 'script',
  taleStartScriptVoice: 'url',
  keywordSentences: [
    { owner: 'usename1', sentence: 'set' },
    { owner: 'usename2', sentence: 'set' },
    { owner: 'usename3', sentence: 'set' },
    { owner: 'usename4', sentence: 'set' },
  ],
  taleStartImage: 'url',
};

//처음에 통신될 init data
const initState = {};

//완성된 햇동화
const hotTale = {
  hotTaleTitle: 'title',
  hotTaleScript: 'script',
  taleHotScriptVoice: 'url',
  keywordSentences: [
    { owner: 'usename1', sentence: [1] },
    { owner: 'usename2', sentence: [1] },
    { owner: 'usename3', sentence: [1] },
    { owner: 'usename4', sentence: [1] },
  ],
  taleStartImage: 'url',
};

const playActions = (set, get) => ({
  setRoomId: (roomId) =>
    set((state) => {
      state.roomId = roomId;
    }),

  setBaseTale: async () => {
    const response = await taleAPI.startTale(get().roomId);

    const baseTale = response.data['data'];

    baseTale?.sentenceOwnerPairs.sort((a, b) => a.order - b.order);

    console.log(baseTale);

    set((state) => {
      state.tale = baseTale;
    });
  },

  setCurrentKeyword: (keyword) =>
    set((state) => {
      state.currentKeyword = keyword;
    }),

  setInputType: (inputType) =>
    set((state) => {
      state.inputType = inputType;
    }),

  setPage: () =>
    set((state) => {
      state.page = state.page + 1;
    }),

  submitTotal: async (keyword) => {
    //MeberId로 order 가져오기
    let order = get().tale?.sentenceOwnerPairs?.find(
      (item) =>
        item.owner === userStore.getState().memberId &&
        item.order === get().page
    )?.['order'];

    console.log(order);

    const data = {
      memberId: userStore.getState().memberId,
      order,
      roomId: get().roomId,
      keyword: keyword,
    };

    const response = await taleAPI.taleSubmitTotal(data);

    return response;
  },
});

const usePlayStore = create(
  devtools(
    immer((set, get) => ({
      tale: { ...tale },
      hotTale: { ...hotTale },
      roomId: 1,
      currentKeyword: '',
      inputType: '',
      page: 0,
      ...playActions(set, get),
    }))
  )
);

export const useTalePlay = () => {
  const tale = usePlayStore((state) => state.tale, shallow);
  const hotTale = usePlayStore((state) => state.hotTale, shallow);
  const roomId = usePlayStore((state) => state.roomId);
  const currentKeyword = usePlayStore((state) => state.currentKeyword);
  const inputType = usePlayStore((state) => state.inputType);
  const page = usePlayStore((state) => state.page);

  const setRoomId = usePlayStore((state) => state.setRoomId);
  const setBaseTale = usePlayStore((state) => state.setBaseTale, shallow);
  const setCurrentKeyword = usePlayStore((state) => state.setCurrentKeyword);
  const setInputType = usePlayStore((state) => state.setInputType);
  const setPage = usePlayStore((state) => state.setPage);

  const submitTotal = usePlayStore((state) => state.submitTotal);

  return {
    tale,
    hotTale,
    roomId,
    currentKeyword,
    inputType,
    page,

    setRoomId,
    setBaseTale,
    setCurrentKeyword,
    setInputType,
    setPage,

    submitTotal,
  };
};
