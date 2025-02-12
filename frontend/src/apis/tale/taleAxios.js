/**
 * author : Oh GwangSik (cheonbi)
 * data : 2025.01.31
 * description : 동화 만들기 API
 * React -> SpringBoot
 */

import { api } from '@/store/userStore';

const taleAPI = {
  //방목록조회
  getAllTaleRooms: () => api.get('tale/rooms'),

  //동화 시작 요청 후 기본동화 정보들 받아옴
  startTale: (roomId) => api.get(`/tale/start/${roomId}`),

  //키워드 확인 API
  taleKeyWordVoice: (data) =>
    api.post('/tale/keyword/voice', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  taleKeyWordHandWrite: (data) =>
    api.post('/tale/keyword/handwrite', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  taleKeyWordTyping: (data) => api.post('/tale/keyword/typing', data),

  //최종 키워드 제출
  taleSubmitTotal: (data) => api.post('/tale/submit/keyword', data), //키워드 최종 제출

  taleSubmitPicture: (data) =>
    api.post('/tale/submit/picture', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }), //그린 동화 제출

  taleHot: (roomId, page) => api.get(`/tale/${roomId}/${page}`),
};

export default taleAPI;
