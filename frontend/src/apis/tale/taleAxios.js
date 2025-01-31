/**
 *
 * author : Oh GwangSik (cheonbi)
 * data : 2025.01.31
 * description : 동화 만들기 API
 * React -> SpringBoot
 */

import { api } from '@/store/userStore';

const taleAPI = {
  startTale: (roomId) => api.get(`/tale/start/${roomId}`),

  taleKeyWordVoice: () => api.post('/tale/keyword/voice'),
  taleKeyWordHandWrite: () => api.post('/tale/keyword/handwrite'),
  taleKeyWordTyping: () => api.post('/tale/keyword/typing'),

  taleKeyWordSubmitTotal: () => api.post('/tale/keyword/submit'),

  taleSubmitPicture: () => api.post('/tale/submit/picture'),

  taleHot: (roomId, page) => api.get(`/tale/temp/${roomId}/${page}`),
};

export default taleAPI;
