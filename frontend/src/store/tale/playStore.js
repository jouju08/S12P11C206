import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import taleAPI from '@/apis/tale/taleAxios';

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

    const { baseTale } = response.data;
    set(
      produce((state) => {
        state.tale = baseTale;
      })
    );
  },

  setCurrentKeyword: () =>
    set((state) => ({
      currentKeyword: state.currentKeyword,
    })),
  setInputType: () =>
    set((state) => ({
      inputType: state.inputType,
    })),
});

const usePlayStore = create(
  devtools(
    immer((set, get) => ({
      tale: { ...tale },
      hotTale: { ...hotTale },
      roomId: 1,
      currentKeyword: '',
      inputType: '',
      ...playActions(set, get),
    }))
  )
);

export const useTalePlay = () => {
  const tale = usePlayStore((state) => state.tale);
  const hotTale = usePlayStore((state) => state.hotTale);
  const roomId = usePlayStore((state) => state.roomId);
  const currentKeyword = usePlayStore((state) => state.currentKeyword);
  const inputType = usePlayStore((state) => state.inputType);

  const setRoomId = usePlayStore((state) => state.setRoomId);
  const setBaseTale = usePlayStore((state) => state.setBaseTale);
  const setCurrentKeyword = usePlayStore((state) => state.setCurrentKeyword);
  const setInputType = usePlayStore((state) => state.setInputType);

  return {
    tale,
    hotTale,
    roomId,
    currentKeyword,
    inputType,

    setRoomId,
    setBaseTale,
    setCurrentKeyword,
    setInputType,
  };
};
