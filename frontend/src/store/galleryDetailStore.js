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
      console.log(`galleryId ${galleryId} 디테일 response 확인: `, response);

      // 응답 데이터가 정상이면 drawingList 업데이트
      if (response.data && response.data.status === 'SU') {
        console.log(`galleryId ${galleryId} 디테일 불러오기 성공: `, response);

        set((state) => {
          state.galleryPage = response.data.data;
        });
      } else {
        throw new Error('API 응답 오류');
      }
    } catch (error) {
      console.log(`galleryId ${galleryId} 디테일 불러오기 실패: `, error);
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
      console.log('좋아요 토글에 따른 응답 ', hasLiked);
      console.log('좋아요 토글에 따른 응답 ', response);

      if (response.data && response.data.status === 'SU') {
        set((state) => {
          state.galleryPage.hasLiked = !hasLiked;
          state.galleryPage.likeCount += hasLiked ? -1 : 1;
          console.log(
            `하트 ${!hasLiked}로 변경, 좋아요 수: ${state.galleryPage.likeCount}`
          );
        });
      } else {
        throw new Error('좋아요 API 응답 오류');
      }
    } catch (error) {
      console.error('좋아요 API 호출 실패: ', error);
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
