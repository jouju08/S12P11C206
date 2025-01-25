package com.ssafy.backend.member.service;

import com.ssafy.backend.common.auth.JwtUtil;
import com.ssafy.backend.db.entity.Member;
import com.ssafy.backend.db.repository.MemberRepository;
import com.ssafy.backend.member.dto.request.LoginRequest;
import com.ssafy.backend.member.dto.request.RegisterRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/*
 *  author : park byeongju
 *  date : 2025.01.25
 *  description : 인증부분 서비스
 *  update
 *      1.
 * */

@Service
@RequiredArgsConstructor
public class AuthService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final RefreshTokenService refreshTokenService;


    /**
     * 회원가입
     */
    public void register(RegisterRequest request) {
        // 중복 체크
        if (memberRepository.existsByLoginId(request.getLoginId())) {
            throw new IllegalArgumentException("이미 존재하는 아이디입니다.");
        }

        // 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(request.getPassword());

        // 회원 저장
        Member member = new Member();
        member.setLoginId(request.getLoginId());
        member.setPassword(encodedPassword);
        member.setEmail(request.getEmail());
        member.setNickname(request.getNickname());
        member.setBirth(request.getBirth());
        member.setLoginType('E');
//        member.setDeleted(false);

        memberRepository.save(member);
    }

    /**
     * 로그인
     */
    public Map<String, String> login(LoginRequest request) {
        // 사용자 조회
        Member member = memberRepository.findByLoginId(request.getLoginId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

        // 비밀번호 검증
        if (!passwordEncoder.matches(request.getPassword(), member.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        // JWT 생성
        String accessToken = jwtUtil.generateToken(member.getLoginId());
        String refreshToken = jwtUtil.generateRefreshToken(member.getLoginId());

        // Redis에 리프레시 토큰 저장
        refreshTokenService.saveRefreshToken(member.getLoginId(), refreshToken);

        // 반환할 토큰 맵 구성
        Map<String, String> tokens = new HashMap<>();
        tokens.put("accessToken", accessToken);
        tokens.put("refreshToken", refreshToken);

        return tokens;
    }

    /**
     * 로그아웃
     */
    public void logout(String loginId) {
        // Redis에서 리프레시 토큰 삭제
        refreshTokenService.deleteRefreshToken(loginId);
    }

    /**
     * 리프레시 토큰을 사용한 액세스 토큰 갱신
     */
    public String refreshAccessToken(String refreshToken) {
        // 리프레시 토큰 유효성 검증
        if (!jwtUtil.validateRefreshToken(refreshToken)) {
            throw new IllegalArgumentException("유효하지 않은 리프레시 토큰입니다.");
        }

        // 리프레시 토큰에서 사용자 정보 추출
        String loginId = jwtUtil.extractUsername(refreshToken);

        // Redis에 저장된 리프레시 토큰과 비교
        if (!refreshTokenService.isValidRefreshToken(loginId, refreshToken)) {
            throw new IllegalArgumentException("리프레시 토큰이 일치하지 않습니다.");
        }

        // 새로운 액세스 토큰 생성 및 반환
        return jwtUtil.generateToken(loginId);
    }
}
