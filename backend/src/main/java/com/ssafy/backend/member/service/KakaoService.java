package com.ssafy.backend.member.service;

import com.ssafy.backend.common.auth.JwtUtil;
import com.ssafy.backend.common.auth.KakaoUserInfo;
import com.ssafy.backend.db.entity.Member;
import com.ssafy.backend.db.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class KakaoService {

    private final MemberRepository memberRepository;
    private final JwtUtil jwtUtil;

    @Value("${oauth_kakao_client_id}")
    private String clientId;

    @Value("${oauth_kakao_redirect_uri}")
    private String redirectUri;

    @Value("${oauth_kakao_secert}")
    private String secret;

    public Map<String, String> kakaoLogin(String code) {
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

//        System.out.println("formattedDate : " + formattedDate);
        Member member = memberRepository.findByLoginId(userInfo.getLoginId())
                .orElseGet(() -> {
                    Member newMember = Member.builder()
                            .loginId(userInfo.getLoginId())
                            .nickname(userInfo.getNickname())
                            .isDeleted(false)
//                            .profileImg()
                            .loginType('K')
                            .birth(formattedDate)
                            .build();
                    return memberRepository.save(newMember);
                });

        // 4. JWT 토큰 생성 및 반환
        String jwtAccessToken = jwtUtil.generateToken(member.getEmail());
        String jwtRefreshToken = jwtUtil.generateRefreshToken(member.getEmail());

        Map<String, String> tokens = new HashMap<>();
        tokens.put("accessToken", jwtAccessToken);
        tokens.put("refreshToken", jwtRefreshToken);
        return tokens;
    }

    private String getKakaoAccessToken(String code) {
        RestTemplate restTemplate = new RestTemplate();
        String url = "https://kauth.kakao.com/oauth/token";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "authorization_code");
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

