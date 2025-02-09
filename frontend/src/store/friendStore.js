import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { getFriendRequests, answerFriendRequest, getFriendList, getDeleteFriend,getSendFriendRequests,getDeleteRequest,getAllMembers,postMakeFriend} from "@/apis/friend/friendAxios";

const useFriendStore = create(
  persist(
    devtools(
      immer((set) => (
        {
        friendRequests: [],
        loading: false,
        error: null,
        friendList:[],
        sendFriendRequests:[],
        searchMembers:[],
        

        // 친구 요청 목록 가져오기
        fetchFriendRequests: async () => {
          console.log("fetchFriendRequests 실행됨");
          set((state) => {
            state.loading = true;
            state.error = null;
          });

          try {
            const data = await getFriendRequests();
       
    
            set((state) => {
                console.log(Array.isArray(data.data));
              state.friendRequests = Array.isArray(data.data) ? [...data.data] : []; 
              state.loading = false;
            });
          } catch (error) {
            set((state) => {
                
              state.error = error.message;
              console.log(" 서버에서 받은 친구 요청 데이터:", state.error);
              state.loading = false;
            });
          }
        },

        //보낸 요청 
        fetchSendFriendRequests: async () => {
            console.log("fetchSendFriendRequests 실행됨");
            set((state) => {
              state.loading = true;
              state.error = null;
            });
  
            try {
              const data = await getSendFriendRequests();
              set((state) => {
                console.log(Array.isArray(data.data));
                state.sendFriendRequests = Array.isArray(data.data) ? [...data.data] : []; 
                console.log("sendFriendRequests: ",state.sendFriendRequests);
                state.loading = false;
              });
            } catch (error) {
              set((state) => {
                  
                state.error = error.message;
                console.log(" 서버에서 받은 친구 요청 데이터:", state.error);
                state.loading = false;
              });
            }
          },

          //보낸 요청 취소
        deleteRequest:async(ToLoginId)=>{
            set((state)=>{
                state.loading=true;
                state.error=null;
            });
            try{
                await getDeleteRequest(ToLoginId);
                await useFriendStore.getState().fetchSendFriendRequests();
                set((state)=>{
                   
                    state.loading=false;
                })
            }catch(error){
                set((state)=>{
                    state.error=error.message;
                    console.log(" 에러 발생:", state.error);
                    state.loading=false;
                })
            }
         },

        // 친구 요청 응답 처리 (수락 / 거절)
        respondToRequest: async (fromLoginId, answer) => {
            set((state) => {
                state.loading = true;
                state.error = null;
              });
          try {
            await answerFriendRequest(fromLoginId, answer);
            await useFriendStore.getState().fetchFriendList();
            set((state) => {
                
              state.loading=false;
            });
          } catch (error) {
            console.error(" Error responding to friend request:", error);
          }
        },

        //친구 리스트
        fetchFriendList: async () => {
            set((state) => {
              state.loading = true;
              state.error = null;
            });
  
            try {
              const data = await getFriendList();

      
              set((state) => {
                  console.log(Array.isArray(data.data));
                state.friendList = Array.isArray(data.data) ? data.data : []; 
                state.loading = false;
              });
            } catch (error) {
              set((state) => {
                  
                state.error = error.message;
                console.log(" 서버에서 받은 친구 데이터:", state.error);
                state.loading = false;
              });
            }
          },
          //친구 삭제
         deleteFriend:async(friendId)=>{
            set((state)=>{
                state.loading=true;
                state.error=null;
            });
            try{
                await getDeleteFriend(friendId);
                await useFriendStore.getState().fetchFriendList();
                set((state)=>{
                    state.loading=false;
                })
            }catch(error){
                set((state)=>{
                    state.error=error.message;
                    console.log(" 에러 발생:", state.error);
                    state.loading=false;
                })
            }
         },
         
         //모든 멤버 불러오기
         fetchFindMembers: async () => {
            console.log("fetchFindMembers 실행됨");
            set((state) => {
              state.loading = true;
              state.error = null;
            });
  
            try {
              const data = await getAllMembers();
              set((state) => {
                console.log(Array.isArray(data.data));
                state.searchMembers = Array.isArray(data.data) ? [...data.data] : []; 
                state.loading = false;
              });
            } catch (error) {
              set((state) => {
                state.error = error.message;
                console.log(" 서버에서 받은 멤버버 데이터:", state.error);
                state.loading = false;
              });
            }
          },

          makeFriend: async (memberId) => {
            console.log("makeFriend 실행됨");
            set((state) => {
              state.loading = true;
              state.error = null;
            });
  
            try {
              const data = await postMakeFriend(memberId);
              await useFriendStore.getState().fetchFindMembers();
              await useFriendStore.getState().fetchSendFriendRequests();
              set((state)=>{
                state.loading=false;
            })
        }catch(error){
            set((state)=>{
                state.error=error.message;
                console.log(" 에러 발생:", state.error);
                state.loading=false;
            })
        }
          }
         


      }))
    ),
    { name: "friend-store" } 
  )
);

export default useFriendStore;
