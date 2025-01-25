package com.ssafy.backend.friends.service;

import com.ssafy.backend.db.entity.Friend;
import com.ssafy.backend.db.entity.Member;
import com.ssafy.backend.db.repository.FriendRepository;
import com.ssafy.backend.db.repository.MemberRepository;
import com.ssafy.backend.dto.MemberDto;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FindFriendService {
    private final MemberRepository memberRepository;
    private FriendRepository friendRepository;
    public FindFriendService(FriendRepository friendRepository, MemberRepository memberRepository) {
        this.friendRepository=friendRepository;
        this.memberRepository = memberRepository;
    }

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
        // 내 회원 ID 가져오기
        long myMemberId = getMemberId(myLoginId);
        // 내 친구 ID 목록 가져오기
        List<Long> friendIds = friendRepository.findFriendById(myMemberId);
        // 친구 ID 목록으로 친구 정보를 일괄 조회
        return memberRepository.findAllById(friendIds)
                .stream()
                .map(member -> new MemberDto(member.getLoginId(), member.getNickname(), member.getProfileImg()))
                        .collect(Collectors.toList());
    }

    //로그인 아이디로 멤버 아이디 가져오기
    public Long getMemberId(String loginId) {
        return memberRepository.findByLoginId(loginId)
                .map(Member::getId)
                .orElseThrow(() -> new IllegalArgumentException("Member not found with loginId: " + loginId));
    }
}

