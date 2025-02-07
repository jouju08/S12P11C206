import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { api } from '../userStore';

//state
const viduToken = '';

const viduActions = (set, get) => ({
  getTokenByAxios: async (roomId) => {
    const response = await api.get('/tale/room/token', {
      params: {
        roomId: roomId,
      },
    });
  },
});

const useViduStore = create(
  devtools(
    immer((set, get) => ({
      viduToken,
      ...viduActions(set, get),
    }))
  )
);

export const useViduHook = () => {
  const getTokenByAxios = useViduStore((state) => state.getTokenByAxios);

  return {
    getTokenByAxios,
  };
};
