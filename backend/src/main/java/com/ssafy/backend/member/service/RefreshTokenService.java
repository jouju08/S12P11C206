package com.ssafy.backend.member.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

/**
 *  author : park byeongju
 *  date : 2025.01.25
 *  description : Redis에 refresh token을 관리하는 서비스
 *  update
 *      1.
 * */

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RedisTemplate<String, Object> redisTemplate;

    @Value("${jwt.refreshExpiration}")
    private long refreshExpiration; // JWT 만료 시간과 동일하게 맞춤

    /**
     * 리프레시 토큰 저장
     * @param loginId
     * @param refreshToken
     */
    public void saveRefreshToken(String loginId, String refreshToken) {
        ValueOperations<String, Object> ops = redisTemplate.opsForValue();
        String key = getRefreshKey(loginId);
        ops.set(key, refreshToken, refreshExpiration, TimeUnit.MILLISECONDS);
    }

    /**
     *리프레시 토큰 확인
     * @param loginId
     * @param refreshToken
     * @return boolean
     */
    public boolean isValidRefreshToken(String loginId, String refreshToken) {
        ValueOperations<String, Object> ops = redisTemplate.opsForValue();
        String savedRefreshToken = (String) ops.get(getRefreshKey(loginId));
        return refreshToken.equals(savedRefreshToken);
    }

    /**
     * 리프레시 토큰 삭제 (로그아웃 시)
     * @param loginId
     */
    public void deleteRefreshToken(String loginId) {
        redisTemplate.delete(getRefreshKey(loginId));
    }

    private String getRefreshKey(String loginId) {
        return "refresh:" + loginId;
    }
}

