package com.ssafy.backend.guide.service;

import com.ssafy.backend.common.exception.BadRequestException;
import com.ssafy.backend.guide.model.Guide;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Service;

/**
 *  author : park byeongju
 *  date : 2025.01.19
 *  description : 잘못된 요청 예외처리 예시
 *  update
 *      1.
 * */

@Service
@RequiredArgsConstructor
public class GuideService {
    private final RedisTemplate<String, Object> redisTemplate;

    public void tryCatchGuide() {
        try{
            // Service logic
        }catch(Exception e){
            throw new BadRequestException("잘못된 요청입니다.");
        }
    }

    public void redisInOutGuide() {
        Guide guide = new Guide(2L, "guide", 3000);
        // 1. 값 넣기
        ValueOperations<String, Object> ops = redisTemplate.opsForValue();
        ops.set("guide", guide);

        // 값 조회
        ValueOperations<String, Object> ops2 = redisTemplate.opsForValue();
        Guide output = (Guide) ops2.get("guide");
        System.out.println(output);

        // 값 삭제
        redisTemplate.delete("guide");
        Guide output2 = (Guide) ops2.get("guide");
        System.out.println(output2); // -> null
    }
}
