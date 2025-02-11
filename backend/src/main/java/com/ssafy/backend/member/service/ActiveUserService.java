package com.ssafy.backend.member.service;

import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 *  author : park byeongju
 *  date : 2025.02.10
 *  description : 접속자 관리 서비스,
 *  update
 *      1.
 * */


@Service
@RequiredArgsConstructor
public class ActiveUserService {
    private final SimpMessagingTemplate messagingTemplate;
    private final RedisTemplate<String, Object> redisTemplate;

    @Scheduled(fixedRate = 30000) // 3초 마다
    public void sendActiveData() {

        ValueOperations<String, Object> ops = redisTemplate.opsForValue();
        Set<Long> activeUsers = new HashSet<>(); // 접속자 초기화
        ops.set("activeUsers", activeUsers);

        messagingTemplate.convertAndSend("/active", "hey!");
    }

    public void addActiveUser(Long memeberId) {
        ValueOperations<String, Object> ops = redisTemplate.opsForValue();
        Set<Long> activeUsers = (Set<Long>) ops.get("activeUsers");
        activeUsers.add(memeberId);
        System.out.println("접속중 : "+ activeUsers);
        ops.set("activeUsers", activeUsers);
    }
}
