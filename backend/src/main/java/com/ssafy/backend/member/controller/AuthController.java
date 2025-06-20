package com.ssafy.backend.member.controller;

import com.ssafy.backend.common.dto.ApiResponse;
import com.ssafy.backend.common.ResponseCode;
import com.ssafy.backend.common.ResponseMessage;
import com.ssafy.backend.common.auth.JwtUtil;
import com.ssafy.backend.common.exception.BadRequestException;
import com.ssafy.backend.common.service.LoginLogService;
import com.ssafy.backend.db.entity.LoginLog;
import com.ssafy.backend.db.entity.Member;
import com.ssafy.backend.friends.dto.request.FindIdRequestDto;
import com.ssafy.backend.member.dto.request.FindPasswordRequestDto;
import com.ssafy.backend.member.dto.request.LoginRequest;
import com.ssafy.backend.member.dto.request.RefreshTokenRequestDto;
import com.ssafy.backend.member.dto.request.RegisterRequest;
import com.ssafy.backend.common.dto.LoginLogAggregateDTO;
import com.ssafy.backend.member.dto.response.LoginResponseDto;
import com.ssafy.backend.member.service.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.*;


/**
 *  author : jung juha
 *  date : 2025.01.21
 *  description : 인증 관련 컨트롤러
 *  update
 *      1. park byeongju - 로그인 리펙토링 및 리프레시 토큰 추가 (25.01.25)
 * */


@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final EmailSendService emailSendService;
    private final RefreshTokenService refreshTokenService;
    private final AuthService authService;
    private final KakaoService kakaoService;
    private final MemberService memberService;
    private final LoginLogService loginLogService;

    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    public ApiResponse<String> register(@RequestBody RegisterRequest request) {
        authService.register(request); // 회원가입 로직 (DB 저장)
        return ApiResponse.<String>builder().data("가입 성공").build();
    }

    @PostMapping("/login")
    public ApiResponse<LoginResponseDto> login(@RequestBody LoginRequest request, HttpServletRequest httpRequest) {

        LoginResponseDto loginDto = authService.login(request, httpRequest);
        String ipAddress = extractClientIp(httpRequest);
        loginLogService.saveLoginLog(loginDto.getMember().getLoginId(), ipAddress);

        return ApiResponse.<LoginResponseDto>builder().data(loginDto).build();
    }

    @PostMapping("/logout")
    public ApiResponse<String> logout(@RequestHeader("Authorization") String header) {
        if(authService.logout(header)){
            return ApiResponse.<String>builder().data("로그아웃 성공").build();
        }
        throw new RuntimeException("로그아웃 도중에 장애가 발생 했습니다.");
    }

    @GetMapping("/kakao/callback")
    public ApiResponse<LoginResponseDto> kakaoCallback(@RequestParam String code, HttpServletRequest httpRequest) {
        LoginResponseDto loginDto = kakaoService.kakaoLogin(code, httpRequest);
        String ipAddress = extractClientIp(httpRequest);
        loginLogService.saveLoginLog(loginDto.getMember().getLoginId(), ipAddress);
        return ApiResponse.<LoginResponseDto>builder().data(loginDto).build();
    }

    @PostMapping("/token/valid/access")
    public ApiResponse<Boolean> validateAccessToken(@RequestBody String accessToken) {
        return ApiResponse.<Boolean>builder().data(authService.validateAccessToken(accessToken)).build();
    }
    @PostMapping("/token/valid/refresh")
    public ApiResponse<Boolean> validateRefreshToken(@RequestBody String loginId, @RequestBody String refreshToken) {
        // 발급된 토큰 유효성 확인 && 레디스 저장 상태 확인
        boolean result = jwtUtil.validateRefreshToken(refreshToken) && refreshTokenService.isValidRefreshToken(loginId, refreshToken);
        return ApiResponse.<Boolean>builder().data(result).build();
    }

    /**
     * Refresh 토큰으로 Access 토큰 재발급
     */
    @PostMapping("/refresh")
    public ApiResponse<Map<String, String>> refreshAccessTokenByRefreshToken(@RequestBody RefreshTokenRequestDto refreshTokenDto) {
        String refreshToken = refreshTokenDto.getRefreshToken();
        return ApiResponse.<Map<String, String>>builder().data(authService.refreshAccessToken(refreshToken)).build();
    }

    @GetMapping("/duplicate/check-id/{loginId}")
    public ApiResponse isDuplicatedId(@PathVariable String loginId) {
        Optional<Member> member = authService.findByLoginId(loginId);
        if (member.isPresent()) {
            return ApiResponse.builder()
                    .data("Duplicated id")
                    .status(ResponseCode.DUPLICATE_ID)
                    .message(ResponseMessage.DUPLICATE_ID)
                    .build();
        }
        else {
            return ApiResponse.builder().data("사용 가능").status(ResponseCode.SUCCESS).status(ResponseMessage.SUCCESS).build();
        }
    }


    @GetMapping("/duplicate/check-email/{email}")
    public ApiResponse isDuplicatedEmail(@PathVariable String email){
        Optional<Member> member = authService.findByEmail(email);
        if(member.isPresent()){
            return ApiResponse.builder()
                    .data("Duplicated email")
                    .status(ResponseCode.DUPLICATE_EMAIL)
                    .message(ResponseMessage.DUPLICATE_EMAIL)
                    .build();
        }
        else{
            return ApiResponse.builder().data("사용 가능한 email").status(ResponseCode.SUCCESS).status(ResponseMessage.SUCCESS).build();
        }
    }

    @GetMapping("/duplicate/check-nickname/{nickname}")
    public ApiResponse isDuplicatedNickname(@PathVariable String nickname){
        Optional<Member> member = authService.findByNickname(nickname);

        if(member.isPresent()){
            return ApiResponse.builder()
                    .data("Duplicated Nickname")
                    .status(ResponseCode.DUPLICATE_NICKNAME)
                    .message(ResponseMessage.DUPLICATE_NICKNAME)
                    .build();
        }
        else{
            return ApiResponse.builder().data("사용 가능한 nickname").status(ResponseCode.SUCCESS).status(ResponseMessage.SUCCESS).build();
        }
    }


    @PostMapping("/find-id")
    public ApiResponse<Object> mailSend(@RequestBody @Valid FindIdRequestDto findIdRequestDto) {
        String email = findIdRequestDto.getEmail();
        String birth = findIdRequestDto.getBirth();
        boolean exists = authService.isMemberExists(email, birth);
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

    @PatchMapping("/find-password")
    public ApiResponse findPassword(@Valid @RequestBody
                                    FindPasswordRequestDto findPasswordRequestDto) {
        String loginId=findPasswordRequestDto.getLoginId();
        String email=findPasswordRequestDto.getEmail();
        memberService.findPasswordService(loginId, email);
        return ApiResponse.builder().data("비밀번호 전송").build();
    }

    @GetMapping("/child")
    public ApiResponse<Object> getLoginLogsForChild(
            @RequestHeader("Authorization") String token,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        String loginId = extractLoginId(token);

        Pageable pageable = PageRequest.of(page, size, Sort.by("loginTime").descending());
        Page<LoginLog> loginLogs = loginLogService.getLoginLogsForChild(loginId, pageable);

        return ApiResponse.builder()
                .data(loginLogs)
                .message("로그인 로그 조회 성공")
                .build();
    }

    @GetMapping("/child/aggregate")
    public ApiResponse<Object> getLoginLogAggregate(@RequestHeader("Authorization") String token) {
        String loginId = extractLoginId(token);
        LoginLogAggregateDTO aggregate = loginLogService.getLoginLogAggregate(loginId);
        return ApiResponse.builder()
                .data(aggregate)
                .message("로그인 로그 집계 조회 성공")
                .build();
    }

    private String extractClientIp(HttpServletRequest request) {
        String ipAddress = request.getHeader("X-Forwarded-For");
        if (ipAddress == null || ipAddress.isEmpty()) {
            ipAddress = request.getRemoteAddr();
        } else {
            ipAddress = ipAddress.split(",")[0].trim();
        }
        return ipAddress;
    }

    private String extractLoginId(String token) {
        if (token == null || !token.startsWith("Bearer ")) {
            throw new BadRequestException("유효하지 않은 토큰입니다.");
        }
        String accessToken = token.substring(7);
        return jwtUtil.extractUsername(accessToken);
    }

}
