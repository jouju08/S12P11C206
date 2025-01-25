package com.ssafy.backend.common.auth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
/*
 *  author : park byeongju
 *  date : 2025.01.25
 *  description : Jwt 토큰(Access, Refresh) 발급, 인증, 재발급
 *  update
 *      1.
 * */

@Slf4j
@Component
public class JwtUtil implements InitializingBean {

    @Value("${jwt.secret}")
    private String base64Secret;  // Base64 인코딩된 시크릿 키 문자열

    private SecretKey secretKey;  // 실제 검증에 사용할 SecretKey 객체

    @Value("${jwt.accessExpiration}")
    private long accessExpiration;

    @Value("${jwt.refreshExpiration}")
    private long refreshExpiration;

    /**
     * 스프링에서 모든 의존성 주입이 끝난 후,
     * Base64로 인코딩된 키 문자열을 SecretKey로 변환한다.
     */
    @Override
    public void afterPropertiesSet() {
        byte[] keyBytes = Decoders.BASE64.decode(this.base64Secret);
        this.secretKey = Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * Access Token 생성
     */
    public String generateToken(String username) {
        System.out.println("만료시간: " + accessExpiration);
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + accessExpiration))
                .signWith(secretKey)
                .compact();
    }

    /**
     * Refresh Token 생성
     */
    public String generateRefreshToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + refreshExpiration))
                .signWith(secretKey)
                .compact();
    }

    /**
     * 토큰에서 사용자 정보 추출
     */
    public String extractUsername(String token) {
        // JJWT 0.11.x 이하에서는 parseClaimsJws, 0.12 이상에서는 parserBuilder() + parseClaimsJws로 사용 가능
        Jws<Claims> claimsJws = Jwts.parser()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token);

        // getBody() == getPayload()
        return claimsJws.getBody().getSubject();
    }

    /**
     * 토큰 검증
     */
    public boolean validateToken(String token, UserDetails userDetails) {
        String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    /**
     * Refresh Token 검증
     */
    public boolean validateRefreshToken(String refreshToken) {
        try {
            Jwts.parser()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(refreshToken);
            return true;
        } catch (JwtException e) {
            log.debug("Invalid Refresh Token: {}", e.getMessage());
            return false;
        }
    }

    /**
     * 토큰 만료 여부 체크
     */
    private boolean isTokenExpired(String token) {
        Jws<Claims> claimsJws = Jwts.parser()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token);

        Date expiration = claimsJws.getBody().getExpiration();
        return expiration.before(new Date());
    }
}


