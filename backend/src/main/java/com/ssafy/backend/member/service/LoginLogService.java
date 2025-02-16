package com.ssafy.backend.member.service;


import com.ssafy.backend.db.entity.LoginLog;
import com.ssafy.backend.db.repository.LoginLogRepository;
import com.ssafy.backend.member.dto.response.LoginLogAggregateDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

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

    public Page<LoginLog> getLoginLogsForChild(String loginId, Pageable pageable) {
        return loginLogRepository.findByLoginId(loginId, pageable);
    }

    public LoginLogAggregateDTO getLoginLogAggregate(String loginId) {
        List<Object[]> results = loginLogRepository.findAggregateDataByLoginId(loginId);
        if (results == null || results.isEmpty()) {
            return new LoginLogAggregateDTO(null, 0L, 0L, 0L);
        }
        Object[] result = results.get(0);

        LocalDateTime lastLogin = null;
        if (result[0] != null) {
            if (result[0] instanceof Timestamp) {
                lastLogin = ((Timestamp) result[0]).toLocalDateTime();
            } else if (result[0] instanceof LocalDateTime) {
                lastLogin = (LocalDateTime) result[0];
            }
        }
        Long dailyCount = result[1] == null ? 0L : ((Number) result[1]).longValue();
        Long weeklyCount = result[2] == null ? 0L : ((Number) result[2]).longValue();
        Long monthlyCount = result[3] == null ? 0L : ((Number) result[3]).longValue();

        return new LoginLogAggregateDTO(lastLogin, dailyCount, weeklyCount, monthlyCount);
    }
}
