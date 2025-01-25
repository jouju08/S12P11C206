package com.ssafy.backend.friends.service;

import com.ssafy.backend.common.auth.JwtUtil;
import com.ssafy.backend.common.exception.BadRequestException;
import com.ssafy.backend.db.entity.Friend;
import com.ssafy.backend.db.entity.FriendRequest;
import com.ssafy.backend.db.entity.Member;
import com.ssafy.backend.db.repository.FriendRepository;
import com.ssafy.backend.db.repository.FriendRequestRepository;
import com.ssafy.backend.db.repository.MemberRepository;
import com.ssafy.backend.dto.FriendDto;
import com.ssafy.backend.dto.MemberDto;
import com.ssafy.backend.member.service.AuthenticationService;
import io.jsonwebtoken.Claims;
import org.apache.catalina.security.SecurityUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FriendRequestService {
    public final FriendRepository friendRepository;
    public final MemberRepository memberRepository;
    public final FriendRequestRepository friendRequestRepository;
    public final FindFriendService findFriendService;
    public FriendRequestService(MemberRepository memberRepository,
                                FriendRepository friendRepository,
                                FriendRequestRepository friendRequestRepository,
                                FindFriendService findFriendService) {
        this.memberRepository = memberRepository;
        this.friendRepository = friendRepository;
        this.friendRequestRepository = friendRequestRepository;
        this.findFriendService=findFriendService;
    }

    public boolean sendFriendRequest(FriendDto friendDto) {
        // 신청자와 수신자 조회
        Member proposer = memberRepository.findById(friendDto.getProposerId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid proposer ID"));
        Member recipient = memberRepository.findById(friendDto.getReceiverId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid receiver ID"));

        Optional<FriendRequest> isfriendRequest = friendRequestRepository.findBySenderIdAndReceiverId(friendDto.getProposerId(), friendDto.getReceiverId());

        if (isfriendRequest.isPresent() && 'P' == isfriendRequest.get().getResponse()) {//이미 신청 되어있디면 예외처리
            throw new BadRequestException("이미 친구 신청 중");
        }
        if (isfriendRequest.isPresent() && 'A' == isfriendRequest.get().getResponse()) {//이미 수락 상태면 예외처리
            throw new BadRequestException("이미 친구 중");
        }

        FriendRequest friendRequest = FriendRequest.builder()
                .proposerId(proposer.getId())
                .recipientId(recipient.getId())
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
            return true;
        } else {
            return false;
        }
    }

    public List<MemberDto> getFriendRequestService(String loginId){
        long memberId = findFriendService.getMemberId(loginId);
        Optional<FriendRequest> requests=friendRequestRepository.findByReceiverMemberId(memberId);
        if (requests.isEmpty()) {
            throw new BadRequestException("Response Dose Not Exist");
        }
        return requests.stream()
                .map(request -> {
                    Member proposer = memberRepository.findById(request.getProposerId())
                            .orElseThrow(() -> new IllegalArgumentException("Invalid proposer ID"));
                    return new MemberDto(proposer.getLoginId(), proposer.getNickname(), proposer.getProfileImg());
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
