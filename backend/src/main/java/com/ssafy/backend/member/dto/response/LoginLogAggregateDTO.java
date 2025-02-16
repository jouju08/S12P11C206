package com.ssafy.backend.member.dto.response;

import lombok.*;

import java.time.LocalDateTime;

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
