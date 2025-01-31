import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer, produce } from 'immer';

//동화 정보
const tale = {
  taleTitle: 'title',
  taleStartScript: 'script',
  taleStartScriptVoice: null,
  keywordSentences: [
    { owner: 'usename1', sentence: 'set' },
    { owner: 'usename2', sentence: 'set' },
    { owner: 'usename3', sentence: 'set' },
    { owner: 'usename4', sentence: 'set' },
  ],
  taleStartImage: 'url',
};

const hotTale = {
  hotTaleTitle: 'title',
  hotTaleScript: 'script',
  taleHotScriptVoice: [],
  keywordSentences: [
    { owner: 'usename1', sentence: [1] },
    { owner: 'usename2', sentence: [1] },
    { owner: 'usename3', sentence: [1] },
    { owner: 'usename4', sentence: [1] },
  ],
  taleStartImage: 'url',
};

const initState = {
  roomId: 1,
  currentKeyword: '',
  inputType: '',
};

const playActions = (set, get) => ({
  setRoomId: () => set((state) => ({ roomId: state.roomId + 1 })),
  setBaseTale: (baseTale) =>
    set(
      produce((state) => {
        state.tale = baseTale;
      })
    ),
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
      ...tale,
      ...initState,
      ...playActions(set, get),
    }))
  )
);

export const useTalePlay = () => {
  const tale = usePlayStore((state) => state.tale);
  const roomId = usePlayStore((state) => state.roomId);
  const currentKeyword = usePlayStore((state) => state.currentKeyword);
  const inputType = usePlayStore((state) => state.inputType);

  const setRoomId = usePlayStore((state) => state.setRoomId);
  const setBaseTale = usePlayStore((state) => state.setBaseTale);
  const setCurrentKeyword = usePlayStore((state) => state.setCurrentKeyword);
  const setInputType = usePlayStore((state) => state.setInputType);
};
