package com.ssafy.backend.member.controller;

import com.ssafy.backend.member.service.ActiveUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashSet;

/**
 *  author : park byeongju
 *  date : 2025.02.10
 *  description : 접속자 관리를 위한 컨트롤러,
 *  update
 *      1.
 * */

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ActiveUserController {

    private final ActiveUserService activeUserService;
    private final RedisTemplate<String, Object> redisTemplate;

    @GetMapping("/active")
    public void manageActiveUser(@RequestParam("memberId") String memeberId){
        activeUserService.addActiveUser(Long.parseLong(memeberId));
    }

    @GetMapping("/active/conf")
    public HashSet<Long> manageActiveUserConf(){
        return (HashSet<Long>) redisTemplate.opsForValue().get("activeBackupUsers");
    }

}
