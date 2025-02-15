package com.ssafy.backend.member.service;


import com.ssafy.backend.db.entity.LoginLog;
import com.ssafy.backend.db.repository.LoginLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class LoginLogService {
    private final LoginLogRepository loginLogRepository;

    @Async
    public void saveLoginLog(String loginId, String ipAddress) {
        LoginLog log = new LoginLog();
        log.setLoginId(loginId);
        log.setIpAddress(ipAddress);
        log.setLoginTime(LocalDateTime.now());
        loginLogRepository.save(log);
    }
}
