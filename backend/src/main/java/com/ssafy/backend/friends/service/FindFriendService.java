package com.ssafy.backend.friends.service;

import com.ssafy.backend.db.entity.Friend;
import com.ssafy.backend.db.entity.Member;
import com.ssafy.backend.db.repository.FriendRepository;
import com.ssafy.backend.db.repository.MemberRepository;
import com.ssafy.backend.dto.MemberDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FindFriendService {
    private final MemberRepository memberRepository;
    private final FriendRepository friendRepository;
    private final RedisTemplate<String, Object> redisTemplate;

    //내 친구들의 로그인 아이디 목록
    public List<String> getFriendsId(String loginId){
        long memberId =getMemberId(loginId);
        List<Long> friends=friendRepository.findFriendById(memberId);//내 친구 아이디 목록
        return friends.stream()
                .map(friendId -> memberRepository.findById(friendId)
                        .map(Member::getLoginId)
                        .orElse(null))  // 없는 경우 null 처리
                .collect(Collectors.toList());
    }

    // 내 친구들의 정보 불러오기
    public List<MemberDto> getFriendsInfo(String myLoginId) {
        Set<Long> activeUserSet = (Set<Long>)redisTemplate.opsForValue().get("activeUsers");

        // 내 회원 ID 가져오기
        long myMemberId = getMemberId(myLoginId);
        // 내 친구 ID 목록 가져오기
        List<Long> friendIds = friendRepository.findFriendById(myMemberId);
        System.out.println(friendIds);

        if(activeUserSet == null){ // null에 대한 에러 방지
            activeUserSet = new HashSet<>();
        }
        Set<Long> finalActiveUserSet = activeUserSet;
        // 친구 ID 목록으로 친구 정보를 일괄 조회
        List<MemberDto> friends =  memberRepository.findAllById(friendIds)
                .stream()
                .map(member -> new MemberDto(member.getLoginId(), member.getNickname(), member.getProfileImg(), finalActiveUserSet.contains(member.getId())))
                        .collect(Collectors.toList());

        return friends;
    }

    //로그인 아이디로 멤버 아이디 가져오기
    public Long getMemberId(String loginId) {
        return memberRepository.findByLoginId(loginId)
                .map(Member::getId)
                .orElseThrow(() -> new IllegalArgumentException("Member not found with loginId: " + loginId));
    }

    public boolean deleteFriend(String loginId, String friendId) {
        Long userID = getMemberId(loginId);
        Long friendID = getMemberId(friendId);
        Friend friend1=friendRepository.findByUserIdAndFriendId(userID, friendID);
        Friend friend2=friendRepository.findByUserIdAndFriendId(friendID,userID);
        System.out.println(friendID);
        System.out.println(userID);
        if(friend1==null||friend2==null) {
            System.out.println(friend1+" "+friend2);
            return false;
        }
        friendRepository.delete(friend1);
        friendRepository.delete(friend2);


        return true;
    }
}

