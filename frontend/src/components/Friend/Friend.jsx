import { useState, useEffect } from 'react';
import { useFriend } from '@/store/friendStore';
import { userStore } from '@/store/userStore';
import { Loading } from '@/common/Loading';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import '@/styles/text.css'
const Friends = ({ friends, setShowFriend, showFriend }) => {
  const [activeTab, setActiveTab] = useState('friends'); // 기본값: 친구 요청
  const {
    friendRequests,
    friendList,
    loading,
    error,
    fetchFriendRequests,
    fetchFriendList,
    deleteFriend,
    respondToRequest,
    fetchSendFriendRequests,
    deleteRequest,
    fetchFindFriends,
    sendFriendRequests,
    fetchFindMembers,
    searchMembers,
    makeFriend,
  } = useFriend();
  const { memberId } = userStore();

  const [searchTerm, setSearchTerm] = useState(''); //검색어
  const [filteredMembers, setFilteredMembers] = useState(searchMembers);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.trim() === '') {
      setFilteredMembers(searchMembers);
      setShowDropdown(false);
    } else {
      const filtered = searchMembers.filter((member) =>
        member.nickname.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredMembers(filtered);
      setShowDropdown(true);
    }
  };

  useEffect(() => {
    if (activeTab === 'friends') {
      fetchFriendList();
    } else if (activeTab === 'get_requests') {
      fetchFriendRequests();
    } else if (activeTab === 'send_requests') {
      fetchSendFriendRequests();
    } else {
      fetchFindMembers();
      console.log(searchMembers);
    }
  }, [activeTab]);

  const handleRespondToRequest = async (loginId, answer) => {
    await respondToRequest(loginId, answer);
    // 상태 업데이트를 위해 friendRequests를 다시 가져옵니다
    fetchFriendRequests();
  };

  // if (loading)
  //   return (
  //     <p>
  //       <Loading />
  //     </p>
  //   );

  const showDeleteSwal = (friendId) => {
    withReactContent(Swal)
      .fire({
        title: (
          <p className="text-text-first service-accent1 mb-7">
            정말 친구를 그만둘까요?
          </p>
        ),
        html: (
          <p className="text-text-second service-regular1 mb-5">
            물론 다시 친구 신청할 수 있어요!
          </p>
        ),
        // icon: "warning",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: (
          <p className="text-white service-regular3">네, 끊을게요!</p>
        ),
        cancelButtonText: (
          <p className="text-white service-regular3">아니에요!</p>
        ),
        width: 500,
        padding: '50px 50px',
      })
      .then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: (
              <p className="text-text-first service-accent1 mb-7">
                친구 삭제 완료
              </p>
            ),

            // icon: "success"
            width: 500,
            padding: '50px 50px',
            cancelButtonText: '닫기',
          });
          deleteFriend(friendId);
        }
      });
  };
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="w-[514px] h-dvh relative bg-white shadow-[4px_4px_4px_0px_rgba(0,0,0,0.10)] flex flex-col justify-between p-6 border border-gray-100">
      <button
        className="h-[30px] w-[30px] mb-4 ml-2"
        onClick={() => setShowFriend(!showFriend)}>
        <img
          src="/Common/black-close.png"
          alt="닫기 버튼"
          className="h-[30px] w-[30px]"
        />
      </button>
      <div className="flex justify-around items-center pb-2 mb-4">
        <button
          onClick={() => setActiveTab('friends')}
          className={`px-3 py-2 cursor-pointer text-text-first text-lg font-NPSfont rounded-full  shadow-[4px_4px_4px_0px_rgba(0,0,0,0.10)] hover:bg-main-point2 transition-colors duration-200
            ${activeTab === 'friends' ? 'bg-main-point2 ' : 'bg-white'}`}>
          친구 목록
        </button>

        <button
          onClick={() => setActiveTab('get_requests')}
          className={`px-3 py-2 cursor-pointer text-text-first text-lg font-NPSfont rounded-full  shadow-[4px_4px_4px_0px_rgba(0,0,0,0.10)] hover:bg-main-point2 transition-colors duration-200
            ${activeTab === 'get_requests' ? 'bg-main-point2' : 'bg-white'}`}>
          받은 친구 신청
        </button>

        <button
          onClick={() => setActiveTab('send_requests')}
          className={`px-3 py-2 cursor-pointer text-text-first text-lg font-NPSfont rounded-full  shadow-[4px_4px_4px_0px_rgba(0,0,0,0.10)] hover:bg-main-point2 transition-colors duration-200
            ${activeTab === 'send_requests' ? 'bg-main-point2' : 'bg-white'}`}>
          보낸 친구 신청
        </button>

        <button
          onClick={() => setActiveTab('find_friends')}
          className={`px-2 py-2 cursor-pointer  text-xl font-NPSfont rounded-full  shadow-[4px_4px_4px_0px_rgba(0,0,0,0.10)] hover:bg-main-point2 transition-colors duration-200
            ${activeTab === 'find_friends' ? 'bg-main-point2' : 'bg-white'}`}>
          <img
            className="w-8 h-7 rounded-full"
            src="/Common/search.png"
          />
        </button>
      </div>

      {/* 받은 친구 요청*/}
      {activeTab === 'get_requests' && (
        <div className="w-[464px] h-full overflow-y-auto bg-white rounded-2xl border border-[#9f9f9f] flex flex-col items-center p-4">
          {friendRequests.length === 0 ? (
            <div className="relative w-full h-full">
              <p className="text-center text-lg text-text-first font-NPSfont absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                받은 친구 요청이 없어요
              </p>
            </div>
          ) : (
            <ul className="w-full">
              {friendRequests.map((friend) => (
                <li
                  key={friend.loginId}
                  className="flex items-center justify-between w-full p-3 border-b border-[#e6e6e6]">
                  <div className="flex items-center gap-3">
                    <img
                      className="w-12 h-12 rounded-full"
                      src={friend.profilePic || '/Common/blank_profile.jpg'}
                      alt="profile"
                    />
                    <span className="text-text-first text-lg font-NPSfont">
                      {friend.nickname}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      // onClick={() => respondToRequest(friend.loginId, 'accept')}
                      onClick={() =>
                        handleRespondToRequest(friend.loginId, 'accept')
                      }
                      className="px-4 py-2 bg-main-success text-text-white rounded-lg hover:bg-green-600 transition-colors duration-200 font-NPSfont ">
                      수락
                    </button>
                    <button
                      // onClick={() => respondToRequest(friend.loginId, 'reject')}
                      onClick={() =>
                        handleRespondToRequest(friend.loginId, 'reject')
                      }
                      className="px-4 py-2 bg-main-choose text-text-white rounded-lg hover:bg-rose-700 transition-colors duration-200 font-NPSfont ">
                      거절
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/*내가 보낸 친구 신청*/}
      {activeTab === 'send_requests' && (
        <div className="w-[464px] h-full overflow-y-auto bg-white rounded-2xl border border-[#9f9f9f] flex flex-col items-center p-4">
          {sendFriendRequests.length === 0 ? (
            <div className="relative w-full h-full">
              <p className="text-center text-lg text-text-first font-NPSfont absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                보낸 친구 요청이 없어요
              </p>
            </div>
          ) : (
            <ul className="w-full">
              {sendFriendRequests.map((friend) => (
                <li
                  key={friend.loginId}
                  className="flex items-center justify-between w-full p-3 border-b border-[#e6e6e6]">
                  <div className="flex items-center gap-3">
                    <img
                      className="w-12 h-12 rounded-full"
                      src={friend.profilePic || '/Common/blank_profile.jpg'}
                      alt="profile"
                    />
                    <span className="text-text-first text-lg font-NPSfont">
                      {friend.nickname}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => deleteRequest(friend.loginId)}
                      className="px-4 py-2 bg-main-choose text-text-white rounded-lg hover:bg-rose-500 transition-colors duration-200 font-NPSfont ">
                      신청 취소
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* 친구 목록 */}
      {activeTab === 'friends' && (
        <div className="w-[464px] h-full overflow-y-auto bg-white rounded-2xl border border-[#9f9f9f] flex flex-col items-center p-4">
          {friendList.length === 0 ? (
            <div className="relative w-full h-full flex flex-col justify-center items-center">
              <img
                className="w-50 h-50"
                src="/Main/main-fairy.png"
              />
              <p className="text-center text-lg text-text-first font-NPSfont">
                친구를 찾아볼까요?
              </p>
            </div>
          ) : (
            <ul className="w-full">
              {friendList.map((friend) => (
                <li
                  key={friend.loginId}
                  className="flex items-center justify-between w-full p-3 border-b border-[#e6e6e6]">
                  <div className="flex items-center gap-3 w-[165px]">
                    <img
                      className="w-12 h-12 rounded-full"
                      src={friend.profilePic || '/Common/blank_profile.jpg'}
                      alt="profile"
                    />  
                    <div className="relative group w-[ch-6] overflow-hidden">
                      {friend.nickname.length<7?(
                        <span className="block  text-text-first text-lg font-NPSfont">
                          {friend.nickname}
                        </span>):(<>
                        <span className="block truncate text-text-first text-lg font-NPSfont group-hover:hidden">
                          {friend.nickname}
                        </span>
                        <span className="whitespace-nowrap hidden text-text-first text-lg font-NPSfont group-hover:block animate-marquee">
                          {friend.nickname}
                        </span></>)}
                    </div>
                  </div>
                  {/* 접속중 상태 */}
                  <div>
                    {friend.connecting ? (
                      <span className="text-text-second relative service-regular3 aftrer:content-[''] after:absolute after:w-full after:h-[5px] after:bottom-[-7px] after:left-0 after:bg-main-success">
                        들어와 있어 !
                      </span>
                    ) : (
                      <span className="text-text-second relative service-regular3 aftrer:content-[''] after:absolute after:w-full after:h-[5px] after:bottom-[-7px] after:left-0 after:bg-main-choose">
                        다음에 놀자~
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => showDeleteSwal(friend.loginId)}
                      className="px-4 py-2 bg-main-choose text-text-white rounded-lg hover:bg-rose-500 transition-colors duration-200 font-NPSfont ">
                      친구 끊기
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/*멤버 검색*/}
      {activeTab === 'find_friends' && (
        <div className="w-[464px] h-full overflow-y-auto bg-white rounded-2xl border border-[#9f9f9f] flex flex-col items-center p-4">
          <input
            type="text"
            placeholder="닉네임을 입력해주세요"
            value={searchTerm}
            onChange={handleSearch}
            className="w-full px-3 py-2 border rounded-md mb-3
    focus:outline-none focus:ring-2 focus:ring-blue-500 service-regular3"
          />
          {showDropdown && (
            <ul className="w-full">
              {filteredMembers.length > 0 ? (
                filteredMembers.map((member) => {
                  const isFriend = friendList.some(
                    (friend) => friend.loginId === member.loginId
                  );
                  const isRequested = sendFriendRequests.some(
                    (friend) => friend.loginId === member.loginId
                  ); //이미 친구 신청중인 사람은 친구 신청 버튼 비활성화
                  return (
                    <li
                      key={member.loginId}
                      className="flex items-center justify-between w-full p-3 border-b border-[#e6e6e6]">
                      <div className="flex items-center gap-3">
                        <img
                          className="w-12 h-12 rounded-full"
                          src={member.profilePic || '/Common/blank_profile.jpg'}
                          alt="profile"
                        />
                        <span className="text-text-first text-lg font-NPSfont">
                          {member.nickname}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {!isRequested && !isFriend && (
                          <button
                            onClick={() => makeFriend(member.loginId)}
                            className="w-[104px] px-4 py-2 bg-main-btn text-text-first rounded-lg service-bold3 hover:bg-main-carrot transition-colors duration-200">
                            친구 신청
                          </button>
                        )}
                        {isRequested && !isFriend && (
                          <button
                            disabled
                            className="w-[104px] px-4 py-2 bg-gray-300 text-white rounded-lg service-bold3">
                            신청중
                          </button>
                        )}
                        {!isRequested && isFriend && (
                          <button
                            disabled
                            className="w-[104px] px-4 py-2 bg-main-strawberry text-white rounded-lg service-bold3">
                            이미 친구
                          </button>
                        )}
                      </div>
                    </li>
                  );
                })
              ) : (
                <li className="px-4 py-4 text-text-second service-regular3 text-center pt-10">
                  닉네임을 다시 확인해주세요!
                </li>
              )}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Friends;
