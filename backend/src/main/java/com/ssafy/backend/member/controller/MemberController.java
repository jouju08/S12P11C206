package com.ssafy.backend.member.controller;

import com.ssafy.backend.common.ApiResponse;
import com.ssafy.backend.db.entity.Member;
import com.ssafy.backend.member.dto.request.ChangePasswordRequestDTO;
import com.ssafy.backend.member.dto.request.UpdateMemberRequestDTO;
import com.ssafy.backend.member.dto.response.GetMemberResponseDTO;
import com.ssafy.backend.member.service.MemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("api/member")
public class MemberController {

    @Autowired
    private MemberService memberService;

    // 회원 정보 조회
    @GetMapping("/mypage")
    public ApiResponse<GetMemberResponseDTO> getMember(String loginId) {
        GetMemberResponseDTO memberResponse = memberService.getMember(loginId);
        return ApiResponse.<GetMemberResponseDTO>builder()  
                .data(memberResponse)
                .build();
    }

    // 회원 정보 수정
    @PatchMapping("/mypage")
    public ApiResponse<Void> updateMember(String LoginId, UpdateMemberRequestDTO updateMemberRequestDTO) {

        memberService.updateMember(LoginId, updateMemberRequestDTO);

        return ApiResponse.<Void>builder()
                .data(null)
                .build();
    }

    // 회원 탈퇴
    @DeleteMapping("/delete")
    public ApiResponse<Void> deleteMember(String loginId) {

        memberService.deleteMember(loginId);

        return ApiResponse.<Void>builder()
                .data(null)
                .build();
    }

    // 비밀번호 수정
    @PatchMapping("/change-password")
    public ApiResponse<Void> changePassword(String loginId, ChangePasswordRequestDTO changePasswordRequestDTO) {

        memberService.changePassword(loginId, changePasswordRequestDTO);

        return ApiResponse.<Void>builder()
                .data(null)
                .build();
    }

    // 프로필 사진 변경
    @PatchMapping("profile-image")
    public ApiResponse<Void> updateProfileImage(String loginId, MultipartFile profileImage) {

        memberService.updateProfileImage(loginId, profileImage);

        return ApiResponse.<Void>builder()
                .data(null)
                .build();
    }
}
