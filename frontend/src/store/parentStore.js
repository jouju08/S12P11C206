import axios from "axios";
import { userStore, useUser } from "./userStore";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { api } from "./userStore";

// const api = axios.create({
//     baseURL: '/api',
// });

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
          console.log('회원정보', response.data.data);
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
          console.log('프로필 정보 불러오기 실패', error);
          throw error;
        }
      },

    updateProfile: async (updateData) => {
      try{
        console.log('프로필 정보', updateData);
        api.defaults.headers.common['Authorization'] = `Bearer ${get().accessToken}`;
        const response = await api.patch('/member/mypage',updateData);
        console.log('프로필 수정 성공', response.data);
        set((state) => {
          state.nickname = response.data.data.nickname;
          state.birth = response.data.data.birth;
        });
      } catch (error) {
        console.log('프로필 수정 실패', error);
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
        console.log('닉네임 중복 체크 실패', error);
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
        console.log(response);
      } catch (error) {
        console.log('프로필 이미지 업데이트 에러',error);
        throw error;
      }
    },

    deleteUser:async()=>{
      try{
        const response=await api.delete("/member/delete");
        console.log(response.data.status);
        console.log(response.data);
        if(response.data.status==="SU"){
          console.log("delete user success");
          return true;
        }
      }catch(error){
          console.log("user delete error", error);
          return false;
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
            console.log('동화목록: ', response.data.data);
            
            set((state) => {
                state.myTales = response.data.data;
            });
        } catch (error) {
            console.log('동화목록 정보 불러오기 실패', error);
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
