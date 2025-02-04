import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { shallow } from 'zustand/shallow';
import taleAPI from '@/apis/tale/taleAxios';
import { userStore } from '../userStore';
import { useRoomStore } from '../roomStore';

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

const currentClient = null;

const drawDirection = [];

//완성된 햇동화
const hotTale = {
  // hotTaleTitle: 'title',
  // hotTaleScript: 'script',
  // taleHotScriptVoice: 'url',
  // keywordSentences: [
  //   { owner: 'usename1', sentence: `[1]` },
  //   { owner: 'usename2', sentence: `[1]` },
  //   { owner: 'usename3', sentence: `[1]` },
  //   { owner: 'usename4', sentence: `[1]` },
  // ],
  // taleStartImage: 'url',
  orderNum: 0, // 0 ~ 3
  memberId: 1,
  taleId: 1, // 동화 id (방 id)
  orginImg: 'url', // 손그림 이미지
  img: 'url', // AI가 그린 이미지
  voice: 'url', // 스크립트 읽는 동화 연기 voice, wav형식
  script: 'str', // 동화내용
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

    set((state) => {
      state.currentClient = useRoomStore.getState().stompClient;
    });

    set((state) => {
      state.tale = baseTale;
    });
  },

  setSubscribeTale: async (roomId) => {
    const client = get().currentClient;

    //그림 문장 채널 구독
    if (client && client.connected) {
      client.subscribe(`/topic/tale/${roomId}`, (message) => {
        get().setDrawDirection(JSON.parse(message.body));
      });
      console.log('Subscribe Sucex');
    }

    console.log(usePlayStore.getState().drawDirection);
    return 1;
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

  addKeyword: (keyword) => {
    set((state) => {
      state.keywords = [...state.keywords, keyword];
    });
  },

  submitTotal: async (keyword) => {
    //MeberId로 order 가져오기
    let order = get().tale?.sentenceOwnerPairs?.find(
      (item) =>
        item.owner === userStore.getState().memberId &&
        item.order === get().page
    )?.['order'];

    const data = {
      memberId: userStore.getState().memberId,
      order,
      roomId: get().roomId,
      keyword: keyword,
    };

    const response = await taleAPI.taleSubmitTotal(data);

    return response;
  },

  setDrawDirection: (directions) => {
    set((state) => {
      state.drawDirection = directions;
    });
  },

  submitPicture: async (picture) => {
    //싱글 모드 차례대로 가져오기
    let order = get().tale?.sentenceOwnerPairs?.find(
      (item) =>
        item.owner === userStore.getState().memberId &&
        item.order === get().page
    )?.['order'];

    const formData = new FormData();

    formData.append('order', String(order));
    formData.append('roomId', String(get().roomId));
    formData.append('memberId', String(userStore.getState().memberId));
    formData.append('file', picture);

    const response = await taleAPI.taleSubmitPicture(formData);

    return response;
  },

  // action
  // tale axios -> roomid, page(1~4)
  setHotTale: async (pageNum) => {
    const response = await taleAPI.taleHot(get().roomId, pageNum);
    const hotPage = response.data['data'];

    set((state) => {
      state.hotTale = hotPage;
    });
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
      keywords: [],
      currentClient,
      drawDirection,
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
  const keywords = usePlayStore((state) => state.keywords);
  const drawDirection = usePlayStore((state) => state.drawDirection);

  const setRoomId = usePlayStore((state) => state.setRoomId);
  const setBaseTale = usePlayStore((state) => state.setBaseTale, shallow);
  const setCurrentKeyword = usePlayStore((state) => state.setCurrentKeyword);
  const setInputType = usePlayStore((state) => state.setInputType);
  const setPage = usePlayStore((state) => state.setPage);

  const addKeyword = usePlayStore((state) => state.addKeyword);
  const submitTotal = usePlayStore((state) => state.submitTotal);
  const submitPicture = usePlayStore((state) => state.submitPicture);

  const currentClient = usePlayStore((state) => state.currentClient);
  const setSubscribeTale = usePlayStore((state) => state.setSubscribeTale);
  const setDrawDirection = usePlayStore((state) => state.setDrawDirection);
  const setHotTale = usePlayStore((state) => state.setHotTale);

  return {
    tale,
    hotTale,
    roomId,
    currentKeyword,
    inputType,
    page,

    keywords,
    drawDirection,

    setRoomId,
    setBaseTale,
    setCurrentKeyword,
    setInputType,
    setPage,

    addKeyword,
    currentClient,
    submitTotal,
    submitPicture,
    setSubscribeTale,
    setDrawDirection,

    setHotTale,
  };
};
