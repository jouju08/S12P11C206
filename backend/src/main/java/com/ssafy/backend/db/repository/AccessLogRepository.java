package com.ssafy.backend.db.repository;

import com.ssafy.backend.db.entity.AccessLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccessLogRepository extends JpaRepository<AccessLog, Long> {
}
