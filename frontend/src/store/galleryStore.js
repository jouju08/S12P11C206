import galleryAPI from '@/apis/gallery/galleryAxios';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

const initialState = {
  myPictures: [],
  hasMore: true,
  pictureDetail: null,
  pictureTitles: [],
};

const myPictureActions = (set, get) => ({
  fetchMyPictures: async (
    page = 0,
    size = 12,
    sort = '전체보기',
    filter = '전체보기'
  ) => {
    try {
      const response = await galleryAPI.fetchMyPictures(
        page,
        size,
        sort,
        filter
      );
      const pageData = response.data.data;
      set((state) => {
        if (page === 0) {
          state.myPictures = pageData.content;
        } else {
          state.myPictures = [...state.myPictures, ...pageData.content];
        }
        state.hasMore = !pageData.last;
      });
    } catch (err) {
      console.log('내 그림 꾸러미 불러오기 실패', err);
    }
  },
  fetchPictureDetail: async (payload) => {
    try {
      const response = await galleryAPI.fetchPictureDetail(payload);
      const detail = response.data.data;
      // 이미지가 없거나 처리 전인 경우 다시 요청
      if (detail.img === null || detail.img === 'before processing') {
        console.log(
          'AI 이미지가 없거나, 전처리중이기 때문에 다시 요청합니다.',
          payload
        );
        const reresponse = await galleryAPI.reRequestAiPicture(payload);
      }
      set((state) => {
        state.pictureDetail = detail;
      });
    } catch (err) {
      console.log('Picture detail fetch failed', err);
    }
  },
  fetchPictureTitles: async () => {
    try {
      const response = await galleryAPI.fetchPictureTitles();
      const titles = response.data.data;
      set((state) => {
        state.pictureTitles = titles;
      });
    } catch (err) {
      console.log('제목 불러오기 실패', err);
    }
  },
  uploadGallery: async (payload) => {
    try {
      const response = await galleryAPI.uploadGallery(payload);
      console.log(response.data.status);
      return response.data.status;
    } catch (err) {
      console.log('자랑하기 실패', err);
    }
  },
});

const myPictureStore = create(
  devtools(
    immer((set, get) => ({
      ...initialState,
      ...myPictureActions(set, get),
      resetState: () => set(() => ({ ...initialState })),
    }))
  )
);

export const useMyPictures = () => {
  const myPictures = myPictureStore((state) => state.myPictures);
  const pictureDetail = myPictureStore((state) => state.pictureDetail);
  const pictureTitles = myPictureStore((state) => state.pictureTitles);
  const hasMore = myPictureStore((state) => state.hasMore);
  const fetchMyPictures = myPictureStore((state) => state.fetchMyPictures);
  const fetchPictureDetail = myPictureStore(
    (state) => state.fetchPictureDetail
  );
  const fetchPictureTitles = myPictureStore(
    (state) => state.fetchPictureTitles
  );
  const uploadGallery = myPictureStore((state) => state.uploadGallery);
  return {
    myPictures,
    pictureDetail,
    pictureTitles,
    hasMore,
    fetchMyPictures,
    fetchPictureDetail,
    fetchPictureTitles,
    uploadGallery,
  };
};
