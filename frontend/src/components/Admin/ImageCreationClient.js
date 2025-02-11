import { create } from 'zustand';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { devtools } from 'zustand/middleware';
import { userStore } from '@/store/userStore';
import { immer } from 'zustand/middleware/immer';

const initialState = {
  titleImages: null,
  introImages: null,
  selectedTitleImage: null,
  selectedIntroImage: null,
  stompClient: null,
};

const tabId = `tab-${Math.random().toString(36).substr(2, 9)}`;

const adminActions = (set, get) => ({
  //소켓 연결
  connect: async () => {
    return new Promise((resolve, reject) => {
      const socket = new SockJS(import.meta.env.VITE_WS_URL);

      console.log(socket);
      const stompClient = new Client({
        webSocketFactory: () => socket,

        onConnect: () => {
          get().subscribeTitleImg();
          get().subscribeIntroImage();
          resolve(stompClient);
        },

        connectHeaders: {
          Authorization: `Bearer ${userStore.getState().accessToken}`,
        },

        onDisconnect: () => console.log('Disconnected'),
        debug: (str) => console.log(str),
      });

      stompClient.activate();

      set({ stompClient });
    });
  },
  subscribeTitleImg: async () => {
    const stompClient = get().stompClient;
    if (!stompClient || !stompClient.connected) {
      return;
    }

    stompClient.subscribe(`/admin/title-image`, (message) => {
      const newImages = JSON.parse(message.body);
      get().setTitleImages(newImages);
      console.log(newImages);
    });
  },

  subscribeIntroImage: async () => {
    const stompClient = get().stompClient;
    if (!stompClient || !stompClient.connected) {
      return;
    }

    stompClient.subscribe(`/admin/intro-image`, (message) => {
      const newImages = JSON.parse(message.body);
      get().setIntroImages(newImages);
      console.log(newImages);
    });
  },

  setTitleImages: (titleImages) => {
    set({ titleImages });
  },
  setIntroImages: (introImages) => {
    set({ introImages });
  },
  setSelectedTitleImage: (selectedTitleImage) => {
    set({ selectedTitleImage });
  },
  setSelectedIntroImage: (selectedIntroImage) => {
    set({ selectedIntroImage });
  },
});

const useAdminStore = create(
  devtools(
    immer((set, get) => ({
      ...initialState,
      ...adminActions(set, get),
      resetState: () => set(() => ({ ...initialState })),
    })),
    { name: `admin-${tabId}` }
  )
);


export const adminStore = () => {
  const connect = useAdminStore((state) => state.connect);
  const titleImages = useAdminStore((state) => state.titleImages);
  const selectedTitleImage = useAdminStore((state) => state.selectedTitleImage);
  const introImages = useAdminStore((state) => state.introImages);
  const selectedIntroImage = useAdminStore((state) => state.selectedIntroImage);
  
  return {
    connect,
    titleImages,
    selectedTitleImage,
    introImages,
    selectedIntroImage,
  };
};

