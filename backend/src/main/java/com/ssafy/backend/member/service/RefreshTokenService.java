package com.ssafy.backend.member.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

/*
 *  author : park byeongju
 *  date : 2025.01.25
 *  description : Redis에 refresh token을 관리하는 서비스
 *  update
 *      1.
 * */

@Service
public class RefreshTokenService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final long refreshExpiration; // JWT 만료 시간과 동일하게 맞춤

    public RefreshTokenService(RedisTemplate<String, Object> redisTemplate,
                               @Value("${jwt.refreshExpiration}") long refreshExpiration) {
        this.redisTemplate = redisTemplate;
        this.refreshExpiration = refreshExpiration;
    }

    // 리프레시 토큰 저장
    public void saveRefreshToken(String username, String refreshToken) {
        ValueOperations<String, Object> ops = redisTemplate.opsForValue();
        String key = getRefreshKey(username);
        ops.set(key, refreshToken, refreshExpiration, TimeUnit.MILLISECONDS);
    }

    // 리프레시 토큰 확인
    public boolean isValidRefreshToken(String username, String refreshToken) {
        ValueOperations<String, Object> ops = redisTemplate.opsForValue();
        String savedRefreshToken = (String) ops.get(getRefreshKey(username));
        return refreshToken.equals(savedRefreshToken);
    }

    // 리프레시 토큰 삭제 (로그아웃 시)
    public void deleteRefreshToken(String username) {
        redisTemplate.delete(getRefreshKey(username));
    }

    private String getRefreshKey(String username) {
        return "refresh:" + username;
    }
}

