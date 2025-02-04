package com.ssafy.backend.member.controller;

import com.ssafy.backend.common.ApiResponse;
import com.ssafy.backend.db.entity.Member;
import com.ssafy.backend.db.entity.Tale;
import com.ssafy.backend.member.dto.request.ChangePasswordRequestDTO;
import com.ssafy.backend.member.dto.request.UpdateMemberRequestDTO;
import com.ssafy.backend.member.dto.response.GetMemberResponseDTO;
import com.ssafy.backend.member.service.MemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.services.s3.model.OptionalObjectAttributes;

import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/member")
public class MemberController {

    private final MemberService memberService;

    // 회원 정보 조회
    @GetMapping("/mypage")
    public ApiResponse<GetMemberResponseDTO> getMember(Authentication authentication) {
        String loginId = authentication.getName();
        GetMemberResponseDTO memberResponse = memberService.getMember(loginId);
        return ApiResponse.<GetMemberResponseDTO>builder()  
                .data(memberResponse)
                .build();
    }

    // 회원 정보 수정
    @PatchMapping("/mypage")
    public ApiResponse<Void> updateMember(
            Authentication authentication,
            @Valid @RequestBody UpdateMemberRequestDTO updateMemberRequestDTO) {

        String loginId = authentication.getName();
        memberService.updateMember(loginId, updateMemberRequestDTO);

        return ApiResponse.<Void>builder()
                .data(null)
                .build();
    }

    // 회원 탈퇴
    @DeleteMapping("/delete")
    public ApiResponse<Void> deleteMember(Authentication authentication) {
        String loginId = authentication.getName();
        memberService.deleteMember(loginId);

        return ApiResponse.<Void>builder()
                .data(null)
                .build();
    }

    // 비밀번호 수정
    @PatchMapping("/change-password")
    public ApiResponse<Void> changePassword(
            Authentication authentication,
            @Valid @RequestBody ChangePasswordRequestDTO changePasswordRequestDTO) {

        String loginId = authentication.getName();
        memberService.changePassword(loginId, changePasswordRequestDTO);

        return ApiResponse.<Void>builder()
                .data(null)
                .build();
    }

    // 프로필 사진 변경
    @PatchMapping("/profile-image")
    public ApiResponse<Void> updateProfileImage(
            Authentication authentication,
            @RequestParam("profileImage") MultipartFile profileImage) {

        String loginId = authentication.getName();
        memberService.updateProfileImage(loginId, profileImage);

        return ApiResponse.<Void>builder()
                .data(null)
                .build();
    }

}
