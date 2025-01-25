package com.ssafy.backend.friends.Controller;

import com.ssafy.backend.common.ApiResponse;
import com.ssafy.backend.common.ResponseCode;
import com.ssafy.backend.common.ResponseMessage;
import com.ssafy.backend.common.exception.BadRequestException;
import com.ssafy.backend.db.repository.MemberRepository;
import com.ssafy.backend.dto.FriendDto;
import com.ssafy.backend.dto.MemberDto;
import com.ssafy.backend.friends.service.FriendRequestService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/api/friend")
@RestController
public class FriendRequestController {

    private final FriendRequestService friendRequestService;
    private final MemberRepository memberRepository;

    public FriendRequestController(FriendRequestService friendRequestService, MemberRepository memberRepository) {
        this.friendRequestService = friendRequestService;
        this.memberRepository = memberRepository;
    }

    @GetMapping("/request")
    public ApiResponse<List<MemberDto>> getFriendRequest(@AuthenticationPrincipal User user) {
        String loginId=user.getUsername();
        List<MemberDto> requestMemberInfo=friendRequestService.getFriendRequestService(loginId);
        if(requestMemberInfo.isEmpty()){
            throw new BadRequestException("Member not found");
        }
        else return ApiResponse.<List<MemberDto>>builder()
                .data(requestMemberInfo)
                .message("User Friend Request Info")
                .build();
    }

    //친구 요청 보내기
    //요청 받아서 이미 친구 신청 중이거나 이미 친구 신청 수락 상태(둘은 이미 친구)라면 예외처리 해놨음
    @PostMapping("/request")
    public ApiResponse<Object> addFriendRequest(@RequestBody FriendDto friendDto) {
        //들어오는 값은 두 사람의 회원 관리 번호(ID 값)
        boolean isRequestSent = friendRequestService.sendFriendRequest(friendDto);
        if(isRequestSent) {
            return ApiResponse.builder().data("성공").build();
        }else {
            throw new BadRequestException("친구 신청 실패");
        }
    }

    //친구 요청 거절 및 수락
    @GetMapping("/{answer}/{fromLoginId}")
    public ApiResponse<Object> getFriendRequests(Authentication auth, @PathVariable String fromLoginId, @PathVariable String answer) {
        User user = (User) auth.getPrincipal();
        String result="";
        if(answer.equals("reject")) {
            boolean Result= friendRequestService.rejectFriendRequest(user.getUsername(),fromLoginId);
            if(Result) {
                result = "User Rejected Friend Request";
            }
            else throw new BadRequestException("친구 요청 거절 실패");
        }
        else if(answer.equals("accept")) {
            boolean Result= friendRequestService.acceptFriendRequest(user.getUsername(),fromLoginId);
            if(Result) {
                result="User Accepted Friend Request";
            }
            else throw new BadRequestException("친구 요청 수락 실패");

        }

        return ApiResponse.builder().data(result).build();
    }




}
