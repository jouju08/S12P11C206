package com.ssafy.backend.friends.Controller;

import com.ssafy.backend.common.ApiResponse;
import com.ssafy.backend.db.entity.Member;
import com.ssafy.backend.dto.MemberDto;
import com.ssafy.backend.friends.service.FindFriendService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/friend")
public class FriendManageController {

    private final FindFriendService findFriendService;

    public FriendManageController(FindFriendService findFriendService) {
        this.findFriendService = findFriendService;
    }

    @GetMapping("/info")
    public ApiResponse<List<MemberDto>> getFriends(Authentication auth) {
        User user = (User) auth.getPrincipal();
        List<MemberDto> myFriendInfo= findFriendService.getFriendsInfo(user.getUsername());
        return ApiResponse.<List<MemberDto>>builder()
                .data(myFriendInfo)
                .message("User Friends Info")
                .build();
    }
}
