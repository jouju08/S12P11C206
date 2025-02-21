import { userStore, useUser } from "./userStore";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { api } from "./userStore";

const initialProfile = {
    memberId: null,
    loginId: null,                      
    email: null,
    nickname: null,
    loginType: null,
    birth: null,
    profileImg: null
  };
  
  const profileActions = (set,get) => ({
    accessToken: userStore.getState().accessToken,
    
    fetchProfile: async () => {
        try{
          api.defaults.headers.common['Authorization'] = `Bearer ${get().accessToken}`;
          const response = await api.get('/member/mypage');

          set((state) => {
            state.memberId = response.data.data.memberId;
            state.loginId = response.data.data.loginId;
            state.email = response.data.data.email;
            state.nickname = response.data.data.nickname;
            state.loginType = response.data.data.loginType
            state.birth = response.data.data.birth;
            state.profileImg = response.data.data.profileImg;
          });
        } catch (error) {
          throw error;
        }
      },

    updateProfile: async (updateData) => {
      try{
        api.defaults.headers.common['Authorization'] = `Bearer ${get().accessToken}`;
        const response = await api.patch('/member/mypage',updateData);

        set((state) => {
          state.nickname = response.data.data.nickname;
          state.birth = response.data.data.birth;
        });
      } catch (error) {
        throw error;
      }
    },
  
    isNicknameAvailable: async(nickname) => {
      try {
        const response = await api.get(`/auth/duplicate/check-nickname/${encodeURIComponent(nickname)}`);
        
        if (response.data.status == 'Success.'){
          return true;
        } else if(response.data.status == 'DN'){
          return false;
        }
      } catch (error) {
        throw error;
      }
    },
  
    updateProfileImage: async (profileImage) => {
      try {
        api.defaults.headers.common['Authorization'] = `Bearer ${get().accessToken}`;
        const response = await api.patch('/member/profile-image',profileImage);
        set((state) => {
          state.profileImg = response.data.data;
        });

      } catch (error) {
        throw error;
      }
    },

    deleteUser:async()=>{
      try{
        const response=await api.delete("/member/delete");

        if(response.data.status==="SU"){
          return true;
        }
      }catch(error){
          return false;
        }
    },

    changePassword: async (oldPassword, newPassword) => {
      try {
        const response = await api.patch("/member/change-password", {
          oldPassword,
          newPassword,
        });

        return response.data;
      } catch (error) {
        throw error;
      }
    },
  
  });
  
  const profileStore = create(
    // Redux DevTools와 연동
    devtools(
      immer((set, get) => ({
        ...initialProfile,
        ...profileActions(set, get),
        resetState: () => set(() => ({ ...initialProfileState })),
      }))
    )
  );
  
  export const useProfile = () => {
    const accessToken = profileStore((state) => state.accessToken);
    const memberId = profileStore((state) => state.memberId);
    const loginId = profileStore((state) => state.loginId);
    const email = profileStore((state) => state.email);
    const nickname = profileStore((state) => state.nickname);
    const loginType = profileStore((state) => state.loginType);
    const birth = profileStore((state) => state.birth);
    const profileImg = profileStore((state) => state.profileImg);
  
    const fetchProfile = profileStore((state) => state.fetchProfile);
    const updateProfile = profileStore((state) => state.updateProfile);
    const isNicknameAvailable = profileStore((state) => state.isNicknameAvailable);
    const updateProfileImage = profileStore((state) => state.updateProfileImage);
    const deleteUser=profileStore((state)=>state.deleteUser);
    const changePassword = profileStore((state) => state.changePassword);

    return {
      memberId,
      loginId,
      email,
      nickname,
      loginType,
      birth,
      profileImg,
  
      fetchProfile,
      updateProfile,
      isNicknameAvailable,
      updateProfileImage,
      deleteUser,
      changePassword,
    };
  };

const initialMyFairyTale = {
    myTales: []
}

const myfairyTaleActions = (set, get) => ({
    
    accessToken: userStore.getState().accessToken,

    fetchMyTale: async () => {
        try {
            api.defaults.headers.common['Authorization'] = `Bearer ${get().accessToken}`;
            const response = await api.get('/tale/my-tale');

            
            set((state) => {
                state.myTales = response.data.data;
            });
        } catch (error) {
            throw error;
        }
    }
});

const myTaleStore = create(
    // Redux DevTools와 연동
    devtools(
      immer((set, get) => ({
        ...initialMyFairyTale,
        ...myfairyTaleActions(set, get),
        resetState: () => set(() => ({ ...initialMyFairyTaleState })),
      }))
    )
);

export const useMyTales = () => {
    const myTales = myTaleStore((state) => state.myTales);

    const fetchMyTale = myTaleStore((state) => state.fetchMyTale);

    return {
        myTales,

        fetchMyTale
    };
};

const initialKidTrackState = {
  loginSummary: null, 
  loginEvents: [],   
  page: 0,
  hasMore: true,
};

const kidTrackActions = (set, get) => ({

  fetchKidTrackAggregate: async () => {
    try {
      
      const response = await api.get("/auth/child/aggregate");
      set((state) => {
        state.loginSummary = response.data.data;
      });
    } catch (error) {
      throw error;
    }
  },

  
  fetchKidTrackEvents: async () => {
    try {
      const response = await api.get("/auth/child", {
        params: { page: get().page, size: 10 },
      });

      const newEvents = response.data.data.content;
      set((state) => {
        state.loginEvents = [...state.loginEvents, ...newEvents];
        if (newEvents.length < 10) {
          state.hasMore = false;
        }
      });
    } catch (error) {
      throw error;
    }
  },

  
  incrementKidTrackPage: () => {
    set((state) => {
      state.page += 1;
    });
    get().fetchKidTrackEvents();
  },

  
  resetKidTrack: () =>
    set(() => ({
      loginSummary: null,
      loginEvents: [],
      page: 0,
      hasMore: true,
    })),
});

const kidTrackStore = create(
  devtools(
    immer((set, get) => ({
      ...initialKidTrackState,
      ...kidTrackActions(set, get),
    }))
  )
);


export const useKidTrack = () => {
  const loginSummary = kidTrackStore((state) => state.loginSummary);
  const loginEvents = kidTrackStore((state) => state.loginEvents);
  const fetchKidTrackAggregate = kidTrackStore((state) => state.fetchKidTrackAggregate);
  const fetchKidTrackEvents = kidTrackStore((state) => state.fetchKidTrackEvents);
  const incrementKidTrackPage = kidTrackStore((state) => state.incrementKidTrackPage);
  const hasMore = kidTrackStore((state) => state.hasMore);
  const page = kidTrackStore((state) => state.page);

  return {
    loginSummary,
    loginEvents,
    fetchKidTrackAggregate,
    fetchKidTrackEvents,
    incrementKidTrackPage,
    hasMore,
    page,
  };
};