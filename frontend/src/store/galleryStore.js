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
      return err;
    }
  },
  fetchPictureDetail: async (payload) => {
    try {
      const response = await galleryAPI.fetchPictureDetail(payload);
      const detail = response.data.data;
      // 이미지가 없거나 처리 전인 경우 다시 요청
      if (detail.img === null || detail.img === 'before processing') {

        const reresponse = await galleryAPI.reRequestAiPicture(payload);
      }
      set((state) => {
        state.pictureDetail = detail;
      });
    } catch (err) {
      return err;
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
      return err;
    }
  },
  uploadGallery: async (payload) => {
    try {
      const response = await galleryAPI.uploadGallery(payload);

      return response.data.status;
    } catch (err) {
      return err;
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
