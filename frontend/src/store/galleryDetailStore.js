import { create } from 'zustand';
import { shallow } from 'zustand/shallow';
import { userStore, api } from './userStore';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

const galleryPage = {
  galleryId: 1,
  taleTitle: 'detail titile',
  img: 'url',
  originImg: 'url',
  author: '테스터',
  authorMemberId: 5,
  taleId: 301,
  sentence: 'str',
  baseTaleId: 1,
  likeCount: 0,
  hasOrigin: false,
  hasLiked: true,
  createdAt: 'str',
};

const initialState = {
  galleryPage: { ...galleryPage },
};

const galleryPageActions = (set, get) => ({
  setGalleryPage: async (galleryId) => {
    try {
      const response = await api.get('/gallery/detail', {
        params: { id: galleryId },
      });


      // 응답 데이터가 정상이면 drawingList 업데이트
      if (response.data && response.data.status === 'SU') {


        set((state) => {
          state.galleryPage = response.data.data;
        });
      } else {
        throw new Error('API 응답 오류');
      }
    } catch (error) {
      return error;
    }
  },

  toggleHasLiked: async () => {
    const { galleryPage } = get();
    const { galleryId, hasLiked, likeCount } = galleryPage;

    try {
      const response = await api.post('/gallery/like', {
        id: galleryId,
        hasLiked: hasLiked,
      });


      if (response.data && response.data.status === 'SU') {
        set((state) => {
          state.galleryPage.hasLiked = !hasLiked;
          state.galleryPage.likeCount += hasLiked ? -1 : 1;

        });
      } else {
        throw new Error('좋아요 API 응답 오류');
      }
    } catch (error) {
      return error;
    }
  },
});

const useGalleryPageStore = create(
  devtools(
    immer((set, get) => ({
      ...initialState,
      ...galleryPageActions(set, get),
      resetState: () => set(() => ({ ...initialState })),
    }))
  )
);

export const useGalleryDetail = () => {
  const galleryPage = useGalleryPageStore(
    (state) => state.galleryPage,
    shallow
  );

  const setGalleryPage = useGalleryPageStore((state) => state.setGalleryPage);
  const toggleHasLiked = useGalleryPageStore((state) => state.toggleHasLiked);

  return {
    galleryPage,

    setGalleryPage,
    toggleHasLiked,
  };
};
