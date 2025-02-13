package com.ssafy.backend.member.service;

import com.ssafy.backend.common.auth.JwtUtil;
import com.ssafy.backend.common.auth.KakaoUserInfo;
import com.ssafy.backend.db.entity.Member;
import com.ssafy.backend.db.repository.MemberRepository;
import com.ssafy.backend.member.dto.response.LoginResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.text.SimpleDateFormat;
import java.util.*;

@Service
@RequiredArgsConstructor
public class KakaoService {

    private final MemberRepository memberRepository;
    private final RefreshTokenService refreshTokenService;
    private final JwtUtil jwtUtil;

    @Value("${OAUTH_KAKAO_CLIENT_ID}")
    private String clientId;

    @Value("${OAUTH_KAKAO_REDIRECT_URI}")
    private String redirectUri;

    @Value("${OAUTH_KAKAO_SECRET}")
    private String secret;

    public LoginResponseDto kakaoLogin(String code) {
        // 1. 카카오 토큰 요청
        String accessToken = getKakaoAccessToken(code);

        // 2. 사용자 정보 요청
        KakaoUserInfo userInfo = getKakaoUserInfo(accessToken);
        System.out.println("userInfo : " + userInfo);
        // 3. 회원가입 또는 로그인 처리

        // 오늘 날짜 패턴 맞추기
        Date today = new Date();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        String formattedDate = sdf.format(today);

        Optional<Member> optionalMember = memberRepository.findByLoginId(userInfo.getLoginId());
        Member member;
        if (optionalMember.isPresent()) {
            member = optionalMember.get();
        } else {
            String tempNickname = userInfo.getNickname();

            do {
                tempNickname = userInfo.getNickname() + UUID.randomUUID().toString().replace("-", "").substring(0, 5);
            } while (memberRepository.findByNickname(tempNickname).isPresent());

            Member newMember = Member.builder()
                    .loginId(userInfo.getLoginId())
                    .nickname(tempNickname)
                    .isDeleted(false)
                    .loginType('K')
                    .birth(formattedDate)
                    .build();
            member = memberRepository.save(newMember);
        }

        // 4. JWT 토큰 생성 및 반환
        String jwtAccessToken = jwtUtil.generateToken(member.getLoginId());
        String jwtRefreshToken = jwtUtil.generateRefreshToken(member.getLoginId());

        // 레디스에 리프레시 토큰 저장
        refreshTokenService.saveRefreshToken(member.getLoginId(), jwtRefreshToken);

        Map<String, String> tokens = new HashMap<>();
        tokens.put("accessToken", jwtAccessToken);
        tokens.put("refreshToken", jwtRefreshToken);


        System.out.println("jwtRefreshToken = " + jwtRefreshToken);
        System.out.println("jwtAccessToken = " + jwtAccessToken);
        System.out.println("member.getLoginId() = " + member.getLoginId());

        LoginResponseDto loginResponseDto = new LoginResponseDto();
        loginResponseDto.setTokens(tokens);
        member.setPassword(null);
        loginResponseDto.setMember(member);


        return loginResponseDto;
    }

    private String getKakaoAccessToken(String code) {
        RestTemplate restTemplate = new RestTemplate();
        String url = "https://kauth.kakao.com/oauth/token";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "authorization_code"); // 고정 값 들어감
        body.add("client_id", clientId);
        body.add("redirect_uri", redirectUri);
        body.add("code", code);
        body.add("client_secret", secret);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);

        return (String) response.getBody().get("access_token");
    }

    private KakaoUserInfo getKakaoUserInfo(String accessToken) {
        RestTemplate restTemplate = new RestTemplate();

        String url = "https://kapi.kakao.com/v2/user/me";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        HttpEntity<Void> request = new HttpEntity<>(headers);
        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, request, Map.class);

        Map<String, Object> kakaoAccount = (Map<String, Object>) response.getBody();
        Map<String, Object> profile = (Map<String, Object>) ((Map<String, Object>) kakaoAccount.get("kakao_account")).get("profile");

        return new KakaoUserInfo(
                kakaoAccount.get("id").toString(),
                (String) profile.get("nickname")
        );
    }
}

