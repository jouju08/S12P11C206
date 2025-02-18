package com.ssafy.backend.friends.service;

import com.ssafy.backend.common.exception.BadRequestException;
import com.ssafy.backend.db.entity.Friend;
import com.ssafy.backend.db.entity.FriendRequest;
import com.ssafy.backend.db.entity.Member;
import com.ssafy.backend.db.repository.FriendRepository;
import com.ssafy.backend.db.repository.FriendRequestRepository;
import com.ssafy.backend.db.repository.MemberRepository;
import com.ssafy.backend.friends.dto.request.FriendRequestDto;
import com.ssafy.backend.member.dto.MemberDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * author : jung juha
 * date : 2025.02.18
 * description : 친구 신청 서비스
 * update
 * 1.
 */

@Service
@RequiredArgsConstructor
public class FriendRequestService {

    public final FriendRepository friendRepository;
    public final MemberRepository memberRepository;
    public final FriendRequestRepository friendRequestRepository;
    public final FindFriendService findFriendService;

    public boolean sendFriendRequest(FriendRequestDto friendRequestDto, String proposerLoginId) {
        // 신청자와 수신자 조회
        Long proposerId =  memberRepository.findByLoginId(proposerLoginId).get().getId();
        String reciepientLoginId =  friendRequestDto.getReceiverLoginId();
        System.out.println(reciepientLoginId);
        Long reciepientId =  memberRepository.findByLoginId(reciepientLoginId).get().getId();
        System.out.println(reciepientId);

        Optional<FriendRequest> isfriendRequest = friendRequestRepository.findBySenderIdAndReceiverId(proposerId, reciepientId);

        if (isfriendRequest.isPresent() && 'P' == isfriendRequest.get().getResponse()) {//이미 신청 되어있디면 예외처리
            throw new BadRequestException("이미 친구 신청 중");
        }
        if (isfriendRequest.isPresent() && 'A' == isfriendRequest.get().getResponse()) {//이미 수락 상태면 예외처리
            throw new BadRequestException("이미 친구 중");
        }

        FriendRequest friendRequest = FriendRequest.builder()
                .proposerId(proposerId)
                .recipientId(reciepientId)
                .response('P') // 초기 상태는 대기 상태
                .build();
        friendRequestRepository.save(friendRequest);//저장
        return true;

    }

    //친구 요청 수락
    public boolean acceptFriendRequest(String toLoginId, String fromLoginId) {

        Member fromMember = memberRepository.findByLoginId(fromLoginId).orElseThrow(() -> new IllegalArgumentException("Invalid member ID"));
        Member toMember = memberRepository.findByLoginId(toLoginId).orElseThrow(() -> new IllegalArgumentException("Invalid member ID"));
        //친구 신청 값 불러오기
        Optional<FriendRequest> optionalRequest = friendRequestRepository.findBySenderIdAndReceiverId(fromMember.getId(), toMember.getId());

        if (optionalRequest.isPresent()) {
            FriendRequest request = optionalRequest.get();
            request.setResponse('A');//수락했다 표시
            friendRequestRepository.save(request);
            //양방향 저장
            saveFriendRelation(fromMember, toMember);
            saveFriendRelation(toMember, fromMember);
            return true;

        } else {
            return false;
        }

    }

    //내가 보낸 친구 요청
    public List<MemberDto> getSendFriendRequestService(String loginId){
        long memberId = findFriendService.getMemberId(loginId);
        List<FriendRequest> requests = friendRequestRepository.findByProposerId(memberId);
        if (requests.isEmpty()) {
            return Collections.emptyList(); // 빈 리스트 반환
        }

        return requests.stream()
                .map(request -> {
                    Member member = memberRepository.findById(request.getRecipientId())
                            .orElseThrow(() -> new IllegalArgumentException("Invalid proposer ID"));
                    return new MemberDto(member.getId(), member.getLoginId(), member.getNickname(), member.getProfileImg(), false);
                })
                .collect(Collectors.toList());
    }

    //친구 요청 거절
    public boolean rejectFriendRequest(String toLoginId, String fromLoginId) {
        Member fromMember = memberRepository.findByLoginId(fromLoginId).orElseThrow(() -> new IllegalArgumentException("Invalid member ID"));
        Member toMember = memberRepository.findByLoginId(toLoginId).orElseThrow(() -> new IllegalArgumentException("Invalid member ID"));
        //친구 신청 값 불러오기
        Optional<FriendRequest> optionalRequest = friendRequestRepository.findBySenderIdAndReceiverId(fromMember.getId(), toMember.getId());

        if (optionalRequest.isPresent()) {
            FriendRequest request = optionalRequest.get();
            request.setResponse('D');//상태 변경
            friendRequestRepository.save(request);//요청 상태 저장
            System.out.println(request.getResponse());
            return true;
        } else {
            return false;
        }
    }

    public List<MemberDto> getFriendRequestService(String loginId){
        long memberId = findFriendService.getMemberId(loginId);
        List<FriendRequest> requests=friendRequestRepository.findByReceiverMemberId(memberId);
        if (requests.isEmpty()) {
            return Collections.emptyList(); // 빈 리스트 반환
        }
        return requests.stream()
                .map(request -> {
                    Member proposer = memberRepository.findById(request.getProposerId())
                            .orElseThrow(() -> new IllegalArgumentException("Invalid proposer ID"));
                    return new MemberDto(proposer.getId() ,proposer.getLoginId(), proposer.getNickname(), proposer.getProfileImg(), false);
                })
                .collect(Collectors.toList());
    }


    private void saveFriendRelation(Member fromMember, Member toMember) {
        Friend friend = new Friend();
        friend.setFromMember(fromMember);
        friend.setToMember(toMember);
        friend.setMemberFromId(fromMember.getId());
        friend.setMemberToId(toMember.getId());
        friendRepository.save(friend);
    }
}
