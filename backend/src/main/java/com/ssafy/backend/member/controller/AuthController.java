package com.ssafy.backend.member.controller;

import com.ssafy.backend.common.ApiResponse;
import com.ssafy.backend.common.auth.JwtUtil;
import com.ssafy.backend.common.exception.UnauthorizedException;
import com.ssafy.backend.db.entity.Member;
import com.ssafy.backend.member.service.AuthenticationService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.val;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthenticationService authenticationService;
    private final AuthenticationManagerBuilder authenticationManager;
    private final UserDetailsService userDetailsService;


    //회원가입
    @PostMapping("/register")   //말 그대로 회원 가입
    public ApiResponse<Object> register(
            @Valid @RequestBody Member member) {
        authenticationService.register(member);
        return ApiResponse.builder().data("성공").build();
    }

    // 로그아웃 API
    @PostMapping("/logout")
    public ApiResponse<String> logout(HttpServletResponse response) {
        // Access 토큰 쿠키 제거
        Cookie accessTokenCookie = new Cookie("accessToken", null);
        accessTokenCookie.setHttpOnly(true);
        accessTokenCookie.setPath("/");
        accessTokenCookie.setMaxAge(0); // 즉시 만료

        // Refresh 토큰 쿠키 제거
        Cookie refreshTokenCookie = new Cookie("refreshToken", null);
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setPath("/");
        refreshTokenCookie.setMaxAge(0); // 즉시 만료

        // 응답에 쿠키 추가
        response.addCookie(accessTokenCookie);
        response.addCookie(refreshTokenCookie);

        return ApiResponse.<String>builder().data("로그아웃 완료").build();
    }

    @PostMapping("/login")
    @ResponseBody
    public ApiResponse<Map<String, String>> loginJwt(@RequestBody Map<String, String> data, HttpServletRequest request, HttpServletResponse response) {
        UsernamePasswordAuthenticationToken authToken =
                new UsernamePasswordAuthenticationToken(data.get("loginId"), data.get("password"));

        Authentication auth = authenticationManager.getObject().authenticate(authToken);

        // Access 토큰과 Refresh 토큰 생성
        String accessToken = JwtUtil.createAccessToken(auth);
        String refreshToken = JwtUtil.createRefreshToken(data.get("loginId"));

        // 쿠키로 전달(예시)
        Cookie accessCookie = new Cookie("accessToken", accessToken);
//        accessCookie.setAttribute("SameSite", "None");
//        accessCookie.setHttpOnly(true);
        accessCookie.setPath("/");
        accessCookie.setMaxAge(30 * 60); // 30분

        Cookie refreshCookie = new Cookie("refreshToken", refreshToken);
//        refreshCookie.setHttpOnly(true);
        refreshCookie.setPath("/");
        refreshCookie.setMaxAge(14 * 24 * 60 * 60); // 2주

        response.addCookie(accessCookie);
        response.addCookie(refreshCookie);
        Map<String, String> map = new HashMap<>();
        map.put("accessToken", accessToken);
        map.put("refreshToken", refreshToken);

        return ApiResponse.<Map<String, String>>builder().data(map).build();
    }

    @PostMapping("/refresh")
    public ApiResponse<?> refreshToken(HttpServletRequest request, HttpServletResponse response) {
        // Refresh 토큰 검증 로직
        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            throw new UnauthorizedException("토큰 없음");
        }

        String refreshToken = Arrays.stream(cookies)
                .filter(c -> "refreshToken".equals(c.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse("");

        if (refreshToken.isEmpty()) {
            throw new UnauthorizedException("토큰 없음");
        }

        try {
            Claims claims = JwtUtil.extractToken(refreshToken);
            if (claims.getExpiration().before(new Date())) {
                throw new UnauthorizedException("refresh 토큰 만료");
            }

            // Refresh 토큰이 유효하다면 새로운 Access 토큰을 만들어 쿠키에 담아준다
            String loginId = claims.get("loginId").toString();
            UserDetails userDetails = userDetailsService.loadUserByUsername(loginId);
            Authentication auth = new UsernamePasswordAuthenticationToken(
                    userDetails, null, userDetails.getAuthorities());

            String newAccessToken = JwtUtil.createAccessToken(auth);
            Cookie newAccessCookie = new Cookie("accessToken", newAccessToken);
            newAccessCookie.setHttpOnly(true);
            newAccessCookie.setPath("/");
            newAccessCookie.setMaxAge(30 * 60);

            response.addCookie(newAccessCookie);

            Map<String, String> map = new HashMap<>();
            map.put("accessToken", newAccessToken);
            map.put("refreshToken", refreshToken);

            return ApiResponse.<Map<String, String>>builder().data(map).build();
        } catch (JwtException e) {
            throw new UnauthorizedException("유효하지 않은 토큰");
        }
    }
}
