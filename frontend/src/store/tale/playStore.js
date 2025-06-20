import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { shallow } from 'zustand/shallow';
import taleAPI from '@/apis/tale/taleAxios';
import { userStore } from '../userStore';
import { useRoomStore } from '../roomStore';
import WavEncoder from 'wav-encoder';

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

const isFinish = false;

const currentClient = null;

const drawDirection = [];

//완성된 햇동화
const hotTale = {
  hotTaleTitle: 'title',
  hotTaleScript: 'script',
  taleHotScriptVoice: 'url',
  keywordSentences: [
    { owner: 'usename1', sentence: `[1]` },
    { owner: 'usename2', sentence: `[1]` },
    { owner: 'usename3', sentence: `[1]` },
    { owner: 'usename4', sentence: `[1]` },
  ],
  taleStartImage: 'url',
};

const playActions = (set, get) => ({
  startTale: () => {},

  setRoomId: (roomId) =>
    set((state) => {
      state.roomId = roomId;
    }),

  setBaseTale: (rawTale) => {


    if (rawTale !== null) {
      const baseTale = { ...rawTale };

      baseTale?.sentenceOwnerPairs.sort((a, b) => a.order - b.order);

      set((state) => {
        state.tale = baseTale;
      });

      return;
    } else {
      return;
    }
  },

  setClient: async () => {
    set({
      currentClient: useRoomStore.getState().stompClient,
    });
  },

  setSubscribeTale: async (roomId) => {
    const client = get().currentClient;

    //그림 문장 채널 구독
    if (client && client.connected) {
      client.subscribe(`/topic/tale/${roomId}`, (message) => {
        get().setDrawDirection(JSON.parse(message.body));
      });

      client.subscribe(`/topic/tale/${roomId}/finish`, (message) => {
        if (message.body == 'finish tale making') {
          set({ isFinish: true });
        }
      });
    }

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

  addPage: () =>
    set((state) => {
      state.page = state.page + 1;
    }),

  setPage: (value) =>
    set((state) => {
      state.page = value;
    }),

  setHotTalePage: (page) => {
    set((state) => {
      state.hotTalePage = page;
    });
  },

  addKeyword: (keyword) => {
    set((state) => {
      state.keywords = [...state.keywords, keyword];
    });
  },

  submitTyping: async (typing) => {
    let order = get().tale?.sentenceOwnerPairs?.find(
      (item) => item.owner === userStore.getState().memberId
    )?.['order'];

    const data = {
      memberId: userStore.getState().memberId,
      order,
      roomId: get().roomId,
      keyword: typing,
    };

    const response = await taleAPI.taleKeyWordTyping(data);

    if (response.data) {
      return response.data;
    } else {
      return false;
    }
  },

  submitVoice: async (voice) => {
    let order = get().tale?.sentenceOwnerPairs?.find(
      (item) => item.owner === userStore.getState().memberId
    )?.['order'];

    const formData = new FormData();

    const fileName = 'recorded-audio.wav';
    const wavBlob = await get().convertWebMBlobToWav(voice);
    const audioFile = new File([wavBlob], fileName, { type: 'audio/wav' });

    formData.append('order', String(order));
    formData.append('roomId', String(get().roomId));
    formData.append('memberId', String(userStore.getState().memberId));
    formData.append('keyword', audioFile);



    const response = await taleAPI.taleKeyWordVoice(formData);

    if (response.data) {
      return response.data;
    } else {
      return false;
    }
  },

  submitHandWrite: async (paint) => {
    let order = get().tale?.sentenceOwnerPairs?.find(
      (item) => item.owner === userStore.getState().memberId
    )?.['order'];

    const formData = new FormData();

    formData.append('order', String(order));
    formData.append('roomId', String(get().roomId));
    formData.append('memberId', String(userStore.getState().memberId));
    formData.append('file', paint);

    const response = await taleAPI.taleKeyWordHandWrite(formData);

    if (response.data.data) {
      return response.data.data;
    } else {
      return false;
    }
  },

  //싱글모드
  submitTypingSingle: async (typing) => {
    let order = get().tale?.sentenceOwnerPairs?.find(
      (item) =>
        item.owner === userStore.getState().memberId &&
        item.order === get().page
    )?.['order'];

    const data = {
      memberId: userStore.getState().memberId,
      order,
      roomId: get().roomId,
      keyword: typing,
    };

    const response = await taleAPI.taleKeyWordTyping(data);

    if (response.data) {
      return response.data;
    } else {
      return false;
    }
  },

  //싱글모드
  submitVoiceSingle: async (voice) => {
    let order = get().tale?.sentenceOwnerPairs?.find(
      (item) =>
        item.owner === userStore.getState().memberId &&
        item.order === get().page
    )?.['order'];

    const formData = new FormData();

    const fileName = 'recorded-audio.wav';
    const wavBlob = await get().convertWebMBlobToWav(voice);


    const audioFile = new File([wavBlob], fileName, { type: 'audio/wav' });

    formData.append('order', String(order));
    formData.append('roomId', String(get().roomId));
    formData.append('memberId', String(userStore.getState().memberId));
    formData.append('keyword', audioFile);

    const response = await taleAPI.taleKeyWordVoice(formData);

    if (response) {
      return response.data;
    } else {
      return false;
    }
  },

  //싱글모드
  submitHandWriteSingle: async (paint) => {
    let order = get().tale?.sentenceOwnerPairs?.find(
      (item) =>
        item.owner === userStore.getState().memberId &&
        item.order === get().page
    )?.['order'];

    const formData = new FormData();

    formData.append('order', String(order));
    formData.append('roomId', String(get().roomId));
    formData.append('memberId', String(userStore.getState().memberId));
    formData.append('keyword', paint);

    const response = await taleAPI.taleKeyWordHandWrite(formData);



    if (response) {
      return response.data.data;
    } else {
      return false;
    }
  },

  // <!---------------------------------------------------------------------------------------->

  // Keyword 최종 제출
  submitTotal: async (keyword) => {
    //MeberId로 order 가져오기
    let order = get().tale?.sentenceOwnerPairs?.find(
      (item) => item.owner === userStore.getState().memberId
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

  //싱글모드 대응
  submitTotalSingle: async (keyword) => {
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

  // < ------------------------------------------------------->
  // <!--바뀐 문장들 그리고 제출 부분 -->
  setDrawDirection: (directions) => {
    set((state) => {
      state.drawDirection = directions;
    });
  },

  //4인모드
  submitPicture: async (picture) => {
    let order = get().tale?.sentenceOwnerPairs?.find(
      (item) => item.owner === userStore.getState().memberId
    )?.['order'];

    const formData = new FormData();

    formData.append('order', String(order));
    formData.append('roomId', String(get().roomId));
    formData.append('memberId', String(userStore.getState().memberId));
    formData.append('file', picture);

    const response = await taleAPI.taleSubmitPicture(formData);

    return response;
  },

  //싱글 모드 차례대로 가져오기
  submitPictureSingle: async (picture) => {


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

  convertWebMBlobToWav: async (webmBlob) => {
    //Buffer
    const arrayBuffer = await webmBlob.arrayBuffer();

    const audioCtx = new AudioContext();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

    const audioData = {
      sampleRate: audioBuffer.sampleRate,
      channelData: [],
    };

    //Channel WAV로 인코딩
    for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
      audioData.channelData.push(audioBuffer.getChannelData(i));
    }

    const wavArrayBuffer = await WavEncoder.encode(audioData);

    return new Blob([wavArrayBuffer], { type: 'audio/wav' });
  },
});

const initialState = {
  tale: null,
  hotTale: null,
  roomId: 1,
  currentKeyword: '',
  inputType: '',
  page: 0,
  hotTalePage: 0,
  keywords: [],
  currentClient,
  drawDirection,
  isFinish,
};

const usePlayStore = create(
  devtools(
    subscribeWithSelector(
      immer((set, get) => ({
        ...initialState,
        ...playActions(set, get),
        resetState: () => set(() => ({ ...initialState })),
      }))
    )
  )
);

// 동화시작시 받아온 rawTale Mapping
useRoomStore.subscribe(
  (state) => state.rawTale,
  (rawTale) => {
    usePlayStore.getState().setBaseTale(rawTale);
  }
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
  const isFinish = usePlayStore((state) => state.isFinish);

  const setRoomId = usePlayStore((state) => state.setRoomId);
  const setBaseTale = usePlayStore((state) => state.setBaseTale, shallow);
  const setCurrentKeyword = usePlayStore((state) => state.setCurrentKeyword);
  const setInputType = usePlayStore((state) => state.setInputType);
  const addPage = usePlayStore((state) => state.addPage);
  const setPage = usePlayStore((state) => state.setPage);

  const addKeyword = usePlayStore((state) => state.addKeyword);
  const submitTotal = usePlayStore((state) => state.submitTotal);
  const submitTotalSingle = usePlayStore((state) => state.submitTotalSingle);

  const submitTyping = usePlayStore((state) => state.submitTyping);
  const submitVoice = usePlayStore((state) => state.submitVoice);
  const submitHandWrite = usePlayStore((state) => state.submitHandWrite);

  const submitTypingSingle = usePlayStore((state) => state.submitTypingSingle);
  const submitVoiceSingle = usePlayStore((state) => state.submitVoiceSingle);
  const submitHandWriteSingle = usePlayStore(
    (state) => state.submitHandWriteSingle
  );

  const submitPicture = usePlayStore((state) => state.submitPicture);
  const submitPictureSingle = usePlayStore(
    (state) => state.submitPictureSingle
  );

  const currentClient = usePlayStore((state) => state.currentClient);
  const setClient = usePlayStore((state) => state.setClient);
  const setSubscribeTale = usePlayStore((state) => state.setSubscribeTale);
  const setDrawDirection = usePlayStore((state) => state.setDrawDirection);
  const setHotTale = usePlayStore((state) => state.setHotTale);

  const resetState = usePlayStore((state) => state.resetState);

  const convertWebMBlobToWav = usePlayStore(
    (state) => state.convertWebMBlobToWav
  );

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
    addPage,
    setPage,

    addKeyword,
    setClient,
    currentClient,

    submitTyping,
    submitVoice,
    submitHandWrite,

    submitTypingSingle,
    submitVoiceSingle,
    submitHandWriteSingle,

    submitTotal,
    submitTotalSingle,

    submitPicture,
    submitPictureSingle,
    setSubscribeTale,
    setDrawDirection,

    isFinish,
    setHotTale,
    resetState,

    convertWebMBlobToWav,
  };
};
