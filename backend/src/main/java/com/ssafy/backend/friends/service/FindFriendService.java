package com.ssafy.backend.friends.service;

import com.ssafy.backend.db.entity.Friend;
import com.ssafy.backend.db.entity.Member;
import com.ssafy.backend.db.repository.FriendRepository;
import com.ssafy.backend.db.repository.MemberRepository;
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
    //내 친구 목록
    public List<String> getFriendsId(String loginId){
        long memberId =getMemberId(loginId);
        List<Long> friends=friendRepository.findFriendByloginId(memberId);
        return friends.stream()
                .map(friendId -> memberRepository.findById(friendId)
                        .map(Member::getLoginId)
                        .orElse(null))  // 없는 경우 null 처리
                .collect(Collectors.toList());
    }

    public Long getMemberId(String loginId) {
        Optional<Member> member = memberRepository.findByLoginId(loginId);
        return member.get().getId();
    }
}

