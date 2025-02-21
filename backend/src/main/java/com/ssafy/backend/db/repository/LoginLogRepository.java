package com.ssafy.backend.db.repository;

import com.ssafy.backend.db.entity.LoginLog;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LoginLogRepository extends JpaRepository<LoginLog, Long> {
    Page<LoginLog> findByLoginId(String loginId, Pageable pageable);

    @Query(value = "SELECT " +
            "    MAX(login_time) as lastLogin, " +
            "    SUM(CASE WHEN login_time >= CURRENT_DATE THEN 1 ELSE 0 END) as dailyCount, " +
            "    SUM(CASE WHEN login_time >= DATE_SUB(CURRENT_DATE, INTERVAL 7 DAY) THEN 1 ELSE 0 END) as weeklyCount, " +
            "    SUM(CASE WHEN login_time >= DATE_SUB(CURRENT_DATE, INTERVAL 1 MONTH) THEN 1 ELSE 0 END) as monthlyCount " +
            "FROM login_log " +
            "WHERE login_id = :loginId",
            nativeQuery = true)
    List<Object[]> findAggregateDataByLoginId(@Param("loginId") String loginId);

}
