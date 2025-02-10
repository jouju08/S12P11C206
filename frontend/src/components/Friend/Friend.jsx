import { useState, useEffect } from 'react';
import useFriendStore from '@/store/friendStore';

const Friends = ({ friends }) => {
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
  } = useFriendStore();
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="w-[496px] h-[497px] relative bg-white shadow-[4px_4px_4px_0px_rgba(0,0,0,0.10)] p-6">
      <div className="flex justify-around pb-2 mb-4">
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
            ${activeTab === 'requests' ? 'bg-main-point2' : 'bg-white'}`}>
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
        <div className="w-[464px] h-[406px] overflow-y-auto bg-white rounded-2xl border border-[#9f9f9f] flex flex-col items-center p-4">
          {friendRequests.length === 0 ? (
            <>
              <p className="text-center text-lg text-text-first font-NPSfont">
                받은 친구 요청이 없어요
              </p>
            </>
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
                      onClick={() => respondToRequest(friend.loginId, 'accept')}
                      className="px-4 py-2 bg-main-success text-text-white rounded-lg hover:bg-green-600 transition-colors duration-200 font-NPSfont ">
                      수락
                    </button>
                    <button
                      onClick={() => respondToRequest(friend.loginId, 'reject')}
                      className="px-4 py-2 bg-main-choose text-text-white rounded-lg hover:bg-rose-500 transition-colors duration-200 font-NPSfont ">
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
        <div className="w-[464px] h-[406px] overflow-y-auto bg-white rounded-2xl border border-[#9f9f9f] flex flex-col items-center p-4">
          {sendFriendRequests.length === 0 ? (
            <p className="text-center text-lg text-text-first font-NPSfont">
              보낸 친구 요청이 없어요
            </p>
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
                      -신청 취소
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
        <div className="w-[464px] h-[406px] overflow-y-auto bg-white rounded-2xl border border-[#9f9f9f] flex flex-col items-center p-4">
          {friendList.length === 0 ? (
            <>
              <img
                className="w-50 h-50"
                src="/Main/main-fairy.png"
              />
              <p className="text-center text-lg text-text-first font-NPSfont">
                친구를 찾아볼까요?
              </p>
            </>
          ) : (
            <ul className="w-full">
              {friendList.map((friend) => (
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
                      onClick={() => deleteFriend(friend.loginId)}
                      className="px-4 py-2 bg-main-choose text-text-white rounded-lg hover:bg-rose-500 transition-colors duration-200 font-NPSfont ">
                      -친구 끊기
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
        <div className="w-[464px] h-[406px] overflow-y-auto bg-white rounded-2xl border border-[#9f9f9f] flex flex-col items-center p-4">
          <input
            type="text"
            placeholder="닉네임을 입력해주세요"
            value={searchTerm}
            onChange={handleSearch}
            className="w-full px-3 py-2 border rounded-md 
    focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  ); //이미 친구 신청중인 사람은 친구 신청 버튼 비활성화화
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
                            className="px-4 py-2 bg-main-btn text-text-first rounded-lg hover:bg-main-carrot transition-colors duration-200 font-NPSfont ">
                            친구 신청
                          </button>
                        )}
                      </div>
                    </li>
                  );
                })
              ) : (
                <li className="px-4 py-4 text-text-first">
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
