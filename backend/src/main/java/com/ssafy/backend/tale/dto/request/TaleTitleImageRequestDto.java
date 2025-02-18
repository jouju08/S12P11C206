package com.ssafy.backend.tale.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * author : heo hyunjun
 * date : 2025.01.31
 * description : 동화 관련 정보를 담는 DTO
 */

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TaleTitleImageRequestDto {
    private Long memberId;
    private String title;
}
