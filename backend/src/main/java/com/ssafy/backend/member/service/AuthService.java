package com.ssafy.backend.member.service;

import com.ssafy.backend.common.util.ProfileInjector;
import com.ssafy.backend.common.auth.JwtUtil;
import com.ssafy.backend.common.exception.NotFoundUserException;
import com.ssafy.backend.db.entity.Member;
import com.ssafy.backend.db.repository.MemberRepository;
import com.ssafy.backend.member.dto.request.LoginRequest;
import com.ssafy.backend.member.dto.request.RegisterRequest;
import com.ssafy.backend.member.dto.response.LoginResponseDto;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
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
    private final RefreshTokenService refreshTokenService;
    private final UserDetailsService userDetailsService;

    private final JwtUtil jwtUtil;

    /**
     * 회원가입
     */
    public void register(RegisterRequest request) {
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
        member.setProfileImg(new ProfileInjector().getRandImg());
//        member.setDeleted(false);

        memberRepository.save(member);
    }



    /**
     * 로그인
     */
    public LoginResponseDto login(LoginRequest request, HttpServletRequest httpRequest) {
        // 사용자 조회
        Member member = memberRepository.findByLoginId(request.getLoginId())
                .orElseThrow(() -> new NotFoundUserException("사용자 정보를 다시 확인하세요."));

        if(member.getIsDeleted()){
            throw new NotFoundUserException("사용자 정보를 다시 확인하세요.");
        }


        // 비밀번호 검증
        if (!passwordEncoder.matches(request.getPassword(), member.getPassword())) {
            throw new NotFoundUserException("사용자 정보를 다시 확인하세요.");
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

        LoginResponseDto loginResponseDto = new LoginResponseDto();
        loginResponseDto.setTokens(tokens);
        member.setPassword(null);
        loginResponseDto.setMember(member);


        return loginResponseDto;
    }

    /**
     * 로그아웃
     */
    public boolean logout(String header) {
        // 클라이언트로부터 기존 토큰 식별/해제 로직 (필요 시 Redis 삭제)
        if (header != null && header.startsWith("Bearer ")) {
            String accessToken = header.substring(7);
            String loginId = jwtUtil.extractUsername(accessToken);
            // 만약 서버 측에 토큰에 대한 로그아웃 기록을 저장한다면 저장 처리
            // refreshToken도 함께 제거
            refreshTokenService.deleteRefreshToken(loginId);
            return true;
        } else {
            return false;
        }
    }

    /**
     * Access 토큰 유효성 검사
     */
    public boolean validateAccessToken(String accessToken) {
        String username = jwtUtil.extractUsername(accessToken);
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        return jwtUtil.validateToken(accessToken, userDetails);
    }

    /**
     * 리프레시 토큰을 사용한 액세스 토큰 갱신
     */
    public Map<String, String> refreshAccessToken(String refreshToken) {
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
        // 새로운 액세스 토큰 생성
        String newAccessToken = jwtUtil.generateToken(loginId);
        Map<String, String> token = new HashMap<>();
        token.put("accessToken", newAccessToken);

        return token;
    }

    public Optional<Member> findByLoginId(String loginId) {
        return memberRepository.findByLoginId(loginId);
    }

    public Optional<Member> findByEmail(String email) {
        return memberRepository.findByEmail(email);
    }

    public Optional<Member> findByNickname(String nickname) {
        return memberRepository.findByNickname(nickname);
    }

    public Optional<Member> findById(Integer Id) {
        return memberRepository.findById(Id);
    }

    public boolean isMemberExists(String email, String birth) {
        return memberRepository.findByEmailAndBirth(email, birth).isPresent();
    }


}

