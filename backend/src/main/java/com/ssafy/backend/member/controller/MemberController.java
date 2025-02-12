package com.ssafy.backend.member.controller;

import com.ssafy.backend.common.ApiResponse;
import com.ssafy.backend.dto.MemberDto;
import com.ssafy.backend.common.auth.JwtUtil;
import com.ssafy.backend.common.exception.BadRequestException;
import com.ssafy.backend.member.dto.request.ChangePasswordRequestDTO;
import com.ssafy.backend.member.dto.request.UpdateMemberRequestDTO;
import com.ssafy.backend.member.dto.response.GetMemberResponseDTO;
import com.ssafy.backend.member.service.MemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
@RestController
@RequiredArgsConstructor
@RequestMapping("api/member")
public class MemberController {

    private final MemberService memberService;
    private final JwtUtil jwtUtil;

    // 회원 정보 조회
    @GetMapping("/mypage")
    public ApiResponse<GetMemberResponseDTO> getMember(@RequestHeader("Authorization") String token) {
        String loginId = extractLoginId(token);
        GetMemberResponseDTO memberResponse = memberService.getMember(loginId);
        return ApiResponse.<GetMemberResponseDTO>builder()
                .data(memberResponse)
                .build();
    }

    // 회원 정보 수정
    @PatchMapping("/mypage")
    public ApiResponse<GetMemberResponseDTO> updateMember(
            @RequestHeader("Authorization") String token,
            @Valid @RequestBody UpdateMemberRequestDTO updateMemberRequestDTO) {

        String loginId = extractLoginId(token);
        GetMemberResponseDTO memberResponse = memberService.updateMember(loginId, updateMemberRequestDTO);

        return ApiResponse.<GetMemberResponseDTO>builder()
                .data(memberResponse)
                .build();
    }

    // 회원 탈퇴
    @DeleteMapping("/delete")
    public ApiResponse<Void> deleteMember(@RequestHeader("Authorization") String token) {
        String loginId = extractLoginId(token);
        memberService.deleteMember(loginId);

        return ApiResponse.<Void>builder()
                .data(null)
                .build();
    }

    // 비밀번호 수정
    @PatchMapping("/change-password")
    public ApiResponse<Void> changePassword(
            @RequestHeader("Authorization") String token,
            @Valid @RequestBody ChangePasswordRequestDTO changePasswordRequestDTO) {

        String loginId = extractLoginId(token);
        memberService.changePassword(loginId, changePasswordRequestDTO);

        return ApiResponse.<Void>builder()
                .data(null)
                .build();
    }

    // 프로필 사진 변경
    @PatchMapping("/profile-image")
    public ApiResponse<String> updateProfileImage(
            @RequestHeader("Authorization") String token, MultipartFile profileImage) {

        String loginId = extractLoginId(token);
        String imgPath = memberService.updateProfileImage(loginId, profileImage);

        return ApiResponse.<String>builder()
                .data(imgPath)
                .build();
    }

    @GetMapping("/all")
    public ApiResponse<List<MemberDto>> getMembers(Authentication auth) {
        String loginId = auth.getName();
        List<MemberDto> allMembers=memberService.getAllMembers(loginId);
        return ApiResponse.<List<MemberDto>>builder().data(allMembers).build();
    }


    private String extractLoginId(String token) {
        if (token == null || !token.startsWith("Bearer ")) {
            throw new BadRequestException("유효하지 않은 토큰입니다.");
        }
        String accessToken = token.substring(7);
        return jwtUtil.extractUsername(accessToken);
    }

}
