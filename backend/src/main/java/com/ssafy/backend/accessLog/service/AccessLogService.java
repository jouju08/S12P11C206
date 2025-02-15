package com.ssafy.backend.accessLog.service;

import com.ssafy.backend.db.entity.AccessLog;
import com.ssafy.backend.db.repository.AccessLogRepository;
import org.springframework.stereotype.Service;

@Service
public class AccessLogService {
    private final AccessLogRepository accessLogRepository;

    public AccessLogService(AccessLogRepository accessLogRepository) {
        this.accessLogRepository = accessLogRepository;
    }

    public void saveLog(AccessLog log) {
        accessLogRepository.save(log);
    }
}
