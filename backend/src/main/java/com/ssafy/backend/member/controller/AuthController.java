package com.ssafy.backend.member.controller;

import com.ssafy.backend.common.ApiResponse;
import com.ssafy.backend.common.ResponseCode;
import com.ssafy.backend.common.ResponseMessage;
import com.ssafy.backend.common.auth.JwtUtil;
import com.ssafy.backend.db.entity.Member;
import com.ssafy.backend.dto.FindIdDto;
import com.ssafy.backend.member.dto.request.LoginRequest;
import com.ssafy.backend.member.dto.request.RegisterRequest;
import com.ssafy.backend.member.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/*
 *  author : jung juha
 *  date : 2025.01.21
 *  description : 인증 관련 컨트롤러
 *  update
 *      1. 0125: 로그인 리펙토링 및 리프레시 토큰 추가
 * */

import java.util.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthenticationService authenticationService;
    private final EmailSendService emailSendService;
    private final AuthenticationManager authenticationManager;
    private final RefreshTokenService refreshTokenService;
    private final AuthService authService;
    private final KakaoService kakaoService;

    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    public ApiResponse<String> register(@RequestBody RegisterRequest request) {
        authService.register(request); // 회원가입 로직 (DB 저장)
        return ApiResponse.<String>builder().data("가입 성공").build();
    }

    @PostMapping("/login")
    public ApiResponse<Map<String, String>> login(@RequestBody LoginRequest request) {
        UsernamePasswordAuthenticationToken authToken =
                new UsernamePasswordAuthenticationToken(request.getLoginId(), request.getPassword());
        Authentication auth = authenticationManager.authenticate(authToken);

        // 로그인 성공 시 JWT 발급
        String accessToken = jwtUtil.generateToken(request.getLoginId());
        String refreshToken = jwtUtil.generateRefreshToken(request.getLoginId());
        refreshTokenService.saveRefreshToken(request.getLoginId(), refreshToken);

        // 프론트엔드에서 accessToken / refreshToken를 쿠키 또는 로컬스토리지에 저장하여 사용
        Map<String, String> tokens = new HashMap<>();
        tokens.put("accessToken", accessToken);
        tokens.put("refreshToken", refreshToken);

        return ApiResponse.<Map<String, String>>builder().data(tokens).build();
    }

    @PostMapping("/logout")
    public ApiResponse<String> logout(@RequestHeader("Authorization") String header) {
        // 클라이언트로부터 기존 토큰 식별/해제 로직 (필요 시 Redis 삭제)
        if (header != null && header.startsWith("Bearer ")) {
            String accessToken = header.substring(7);
            String username = jwtUtil.extractUsername(accessToken);
            // 만약 서버 측에 토큰에 대한 로그아웃 기록을 저장한다면 저장 처리
            // refreshToken도 함께 제거
            refreshTokenService.deleteRefreshToken(username);
        }
        System.out.println("로그아웃");
        return ApiResponse.<String>builder().data("로그아웃 성공").build();
    }

    @GetMapping("/kakao/callback")
    public ApiResponse<Map<String, String>> kakaoCallback(@RequestParam String code) {
        Map<String, String> tokens = kakaoService.kakaoLogin(code);
        return ApiResponse.<Map<String, String>>builder().data(tokens).build();
    }

    @PostMapping("/refresh")
    public ApiResponse<Map<String, String>> refresh(@RequestBody Map<String, String> tokenMap) {
        // 프론트엔드에서 전달한 refreshToken 확인
        String refreshToken = tokenMap.get("refreshToken");
        if (jwtUtil.validateRefreshToken(refreshToken)) {
            String username = jwtUtil.extractUsername(refreshToken);
            // Redis에 저장된 리프레시 토큰과 비교
            if (refreshTokenService.isValidRefreshToken(username, refreshToken)) {
                String newAccessToken = jwtUtil.generateToken(username);
                Map<String, String> token = new HashMap<>();
                token.put("accessToken", newAccessToken);
                return ApiResponse.<Map<String, String>>builder().data(token).build();
            }
        }
        return ApiResponse.<Map<String, String>>builder().data(null).build();
    }

    @GetMapping("/check-id/{loginId}")
    public ApiResponse<Object> isDuplicatedId(@PathVariable String loginId) {
        Optional<Member> member = authenticationService.findByLoginId(loginId);
        if (member.isPresent()) {
            return ApiResponse.builder()
                    .data("Duplicated id")
                    .status(ResponseCode.DUPLICATE_ID)
                    .message(ResponseMessage.DUPLICATE_ID)
                    .build();
        }
        else {
            return ApiResponse.builder().data("사용 가능").build();
        }
    }


    @GetMapping("/check-email/{email}")
    public ApiResponse<Object> isDuplicatedEmail(@PathVariable String email){
        Optional<Member> member = authenticationService.findByEmail(email);
        if(member.isPresent()){
            return ApiResponse.builder()
                    .data("Duplicated email")
                    .status(ResponseCode.DUPLICATE_EMAIL)
                    .message(ResponseMessage.DUPLICATE_EMAIL)
                    .build();
        }
        else{
            return ApiResponse.builder().data("사용 가능한 email").build();
        }
    }

    @GetMapping("/check-nickname/{nickname}")
    public ApiResponse<Object> isDuplicatedNickname(@PathVariable String nickname){
        Optional<Member> member = authenticationService.findByNickname(nickname);
        if(member.isPresent()){
            return ApiResponse.builder()
                    .data("Duplicated Nickname")
                    .status(ResponseCode.DUPLICATE_NICKNAME)
                    .message(ResponseMessage.DUPLICATE_NICKNAME)
                    .build();
        }
        else{
            return ApiResponse.builder().data("사용 가능한 nickname").build();
        }
    }


    @PostMapping("/find-id")
    public ApiResponse<Object> mailSend(@RequestBody @Valid FindIdDto findIdDto) {
        String email = findIdDto.getEmail();
        String birth = findIdDto.getBirth();
        boolean exists = authenticationService.isMemberExists(email, birth);
        if (exists) {
            String loginID=emailSendService.findIdEmail(email);
            return ApiResponse.builder()
                    .data("loginID:"+loginID)
                    .message(email+"으로 아이디 전송 완료")
                    .build();
        }
        else {
            return ApiResponse.builder()
                    .data("Not Found")
                    .status(ResponseCode.NOT_FOUND)
                    .message(ResponseMessage.NOT_FOUND)
                    .build();

        }
    }



}
