package com.ssafy.backend.common.service;

import com.ssafy.backend.db.entity.AccessLog;
import com.ssafy.backend.db.repository.AccessLogRepository;
import org.springframework.stereotype.Service;

/**
 *  author : lee youngjae
 *  date : 2025.02.17
 *  description : 로그인 로깅 서비스 파일
 *  update
 *      1.
 * */

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
