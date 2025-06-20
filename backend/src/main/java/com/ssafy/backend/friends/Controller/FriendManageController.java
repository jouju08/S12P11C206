package com.ssafy.backend.friends.Controller;

import com.ssafy.backend.common.dto.ApiResponse;
import com.ssafy.backend.common.ResponseMessage;
import com.ssafy.backend.common.exception.BadRequestException;
import com.ssafy.backend.db.repository.MemberRepository;
import com.ssafy.backend.friends.dto.request.FriendRequestDto;
import com.ssafy.backend.friends.service.FriendRequestService;
import com.ssafy.backend.member.dto.MemberDto;
import com.ssafy.backend.friends.service.FindFriendService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * author : jung juha
 * date : 2025.02.18
 * description : 친구 신청 관련 컨트롤러
 * update
 * 1.
 */

@RestController
@RequestMapping("/api/friend")
@RequiredArgsConstructor
public class FriendManageController {

    private final FindFriendService findFriendService;
    private final FriendRequestService friendRequestService;
    private final MemberRepository memberRepository;

    //내 친구 목록
    @GetMapping("/info")
    public ApiResponse<List<MemberDto>> getFriends(Authentication auth) {
        User user = (User) auth.getPrincipal();
        List<MemberDto> myFriendInfo = findFriendService.getFriendsInfo(user.getUsername());
        return ApiResponse.<List<MemberDto>>builder().data(myFriendInfo).message("User Friends Info").build();
    }

    @GetMapping("/delete/{friendId}")
    public ApiResponse deleteFriend(Authentication auth, @PathVariable String friendId) {
        User user = (User) auth.getPrincipal();
        boolean response = findFriendService.deleteFriend(user.getUsername(), friendId);
        if (response) {
            return ApiResponse.builder().data(true).message(ResponseMessage.SUCCESS).build();
        } else return ApiResponse.builder().data(false).message(ResponseMessage.BAD_REQUEST).build();
    }

    //받은 친구요청 목록 받아오기
    @GetMapping("/request")
    public ApiResponse<List<MemberDto>> getFriendRequest(@AuthenticationPrincipal User user) {
        String loginId = user.getUsername();
        List<MemberDto> requestMemberInfo = friendRequestService.getFriendRequestService(loginId);
        return ApiResponse.<List<MemberDto>>builder().data(requestMemberInfo).message("User Friend Request Info").build();
    }

    //보낸 친구요청 목록 받아오기
    @GetMapping("/request/send")
    public ApiResponse<List<MemberDto>> getSendFriendRequest(@AuthenticationPrincipal User user) {
        String loginId = user.getUsername();
        List<MemberDto> requestMemberInfo = friendRequestService.getSendFriendRequestService(loginId);
        return ApiResponse.<List<MemberDto>>builder().data(requestMemberInfo).message("User Friend Request Info").build();
    }

    //친구 요청 보내기
    //요청 받아서 이미 친구 신청 중이거나 이미 친구 신청 수락 상태(둘은 이미 친구)라면 예외처리 해놨음
    @PostMapping("/request")
    public ApiResponse<Object> addFriendRequest(@AuthenticationPrincipal User user, @RequestBody FriendRequestDto friendRequestDto) {
        String loginId = user.getUsername();
        //들어오는 값은 두 사람의 회원 관리 번호(ID 값)
        boolean isRequestSent = friendRequestService.sendFriendRequest(friendRequestDto, loginId);
        if (isRequestSent) {
            return ApiResponse.builder().data("성공").build();
        } else {
            throw new BadRequestException("친구 신청 실패");
        }
    }

    //친구 요청 거절 및 수락
    @GetMapping("/request/{answer}/{fromLoginId}")
    public ApiResponse<Object> answerFriendRequests(Authentication auth, @PathVariable String fromLoginId, @PathVariable String answer) {
        User user = (User) auth.getPrincipal();
        String result = "";
        if (answer.equals("reject")) {
            boolean Result = friendRequestService.rejectFriendRequest(user.getUsername(), fromLoginId);
            if (Result) {
                result = "User Rejected Friend Request";
            } else throw new BadRequestException("친구 요청 거절 실패");
        } else if (answer.equals("accept")) {
            boolean Result = friendRequestService.acceptFriendRequest(user.getUsername(), fromLoginId);
            if (Result) {
                result = "User Accepted Friend Request";
            } else throw new BadRequestException("친구 요청 수락 실패");

        }

        return ApiResponse.builder().data(result).build();
    }


    //내가 보낸 친구 요청 취소
    @GetMapping("/request/cancel/{ToLoginId}")
    public ApiResponse<Object> cancelFriendRequests(Authentication auth, @PathVariable String ToLoginId) {
        User user = (User) auth.getPrincipal();
        String result = "";
        boolean Result = friendRequestService.rejectFriendRequest(ToLoginId, user.getUsername());
        if (Result) {
            result = "User Canceled Friend Request";
        } else throw new BadRequestException("친구 요청 취소 실패");

        return ApiResponse.builder().data(result).build();
    }
}
