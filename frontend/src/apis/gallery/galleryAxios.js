import { api } from '@/store/userStore';

const galleryAPI = {
  // 내가 그린 그림 조회
  fetchMyPictures: (
    page = 0,
    size = 12,
    sort = '전체보기',
    filter = '전체보기'
  ) =>
    api.get(
      `/talemember/view/my-pictures?page=${page}&size=${size}&sort=${sort}&filter=${filter}`
    ),
  fetchPictureDetail: (payload) =>
    api.get('/talemember/view/picture-detail', { params: payload }),
  fetchPictureTitles: () => api.get('/talemember/view/picture-titles'),
  uploadGallery: (payload) => api.post('/gallery', payload),
  reRequestAiPicture: (payload) =>
    api.post('/talemember/resubmit/picture', { params: payload }),
};

export default galleryAPI;
