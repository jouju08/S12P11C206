/**
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
  taleKeyWordTyping: (keyword) => api.post('/tale/keyword/typing', { keyword }),

  taleSubmitTotal: (data) => api.post('/tale/submit/keyword', data), //키워드 최종 제출

  taleSubmitPicture: (data) =>
    api.post('/tale/submit/picture', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }), //그린 동화 제출

  taleHot: (roomId, page) => api.get(`/tale/temp/${roomId}/${page}`),
};

export default taleAPI;
