import { api } from '@/store/userStore';

const taleAPI = {
  fetchRooms: () => api.get('/tale/rooms'),
};

export default taleAPI;
