
import { api } from '@/store/userStore';

export const getFriendRequests = async () => {
  console.log("getFriendRequests() 실행됨");
  try {
    const response = await api.get("/friend/request");
    console.log("API 응답 데이터:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch friend requests:", error);
    throw error;
  }
};

// 친구 요청 응답 (수락 또는 거절)
export const answerFriendRequest = async (fromLoginId, answer) => {
  try {
    const response = await api.get(`/friend/request/${answer}/${fromLoginId}`, {
      withCredentials: true,
    });
    console.log("response");
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to answer friend request:", error);
    throw error;
  }
};

export const getFriendList=async()=>{
  try{
    const response=await api.get(`/friend/info`,{
      withCredentials:true,
    });
    return response.data;
  }catch(error){
    console.error("Failed to answer friend info:", error);
    throw error;
  }
};


export const getDeleteFriend=async(friendId)=>{
  try{
    const response=await api.get(`/friend/delete/${friendId}`,{
      withCredentials:true,
    });
    console.log(response.data);
    return response.data;
  }catch(error){
    console.error("Failed to answer friend delete", error);
    throw error;
  }
};

export const getDeleteRequest=async(ToLoginId)=>{
  try{
    const response=await api.get(`/friend/request/cancel/${ToLoginId}`,{
      withCredentials:true,
    });
    console.log(response.data);
    return response.data;
  }catch(error){
    console.error("Failed to answer friend delete", error);
    throw error;
  }
};

export const getSendFriendRequests = async () => {
  console.log("getSendFriendRequests() 실행됨");
  try {
    const response = await api.get("/friend/request/send");
    console.log("API 응답 데이터:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch friend requests:", error);
    throw error;
    }
  };
  export const getAllMembers = async () => {
    console.log("getAllMembers() 실행됨");
    try {
      const response = await api.get("/member/all");
      console.log("API 응답 데이터:", response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch friend requests:", error);
      throw error;
    }
  };

  export const postMakeFriend=async(memberId)=>{
    console.log("postMakeFriend() 실행");
    try{
      const response=await api.post(`friend/request`, {"receiverLoginId":memberId});
      return response.data;
    }catch (error) {
      console.error("Failed to fetch friend requests:", error);
      throw error;
    }
  }


