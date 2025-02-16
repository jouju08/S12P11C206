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
 * author : park byeongju
 * date : 2025.02.10
 * description : 접속자 관리 서비스,
 * update
 * 1.
 */


@Service
@RequiredArgsConstructor
public class ActiveUserService {
    private final SimpMessagingTemplate messagingTemplate;
    private final RedisTemplate<String, Object> redisTemplate;

//    private int time = 0;

    @Scheduled(fixedRate = 20000)
    public void userActiveManageSchedule() {
        ValueOperations<String, Object> ops = redisTemplate.opsForValue();
//        ops.set("activeUsers", activeUsers);

        // 1. 접속자 자료구조 2개 체킹
//        Set<Long> activeUsers = ops.get("activeUsers") != null ? (Set<Long>) ops.get("activeUsers") : new HashSet<>();
        Set<Long> activeBackupUsers = ops.get("activeBackupUsers") != null ? (Set<Long>) ops.get("activeBackupUsers") : new HashSet<>();
        Set<Long> activeUsersTemp = new HashSet<>();

        ops.set("activeUsers", activeBackupUsers);
        ops.set("activeBackupUsers", activeUsersTemp);

    }

    @Scheduled(fixedRate = 3000) // 10초 마다
    public void sendActiveDataSchedule() {
//        time++;
//        System.out.println("sendActiveDataSchedule : " + time);
        messagingTemplate.convertAndSend("/active", "ping");
    }

    public void addActiveUser(Long memeberId) {
        ValueOperations<String, Object> ops = redisTemplate.opsForValue();
        Set<Long> activeUsers = (Set<Long>) ops.get("activeUsers");
        Set<Long> activeBackupUsers = (Set<Long>) ops.get("activeBackupUsers");
        activeUsers.add(memeberId);
        activeBackupUsers.add(memeberId);
        System.out.println("접속중 : " + activeUsers);
        ops.set("activeUsers", activeUsers);
        ops.set("activeBackupUsers", activeBackupUsers);
    }
}
