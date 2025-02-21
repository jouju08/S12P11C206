package com.ssafy.backend.common.dto;

import lombok.*;

import java.time.LocalDateTime;

/**
 *  author : park byeongju
 *  date : 2025.02.16
 *  description : 로그인 로깅 제공 위한 응답 DTO
 *  update
 *      1.
 * */

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoginLogAggregateDTO {
    private LocalDateTime lastLogin;
    private Long dailyCount;
    private Long weeklyCount;
    private Long monthlyCount;
}
