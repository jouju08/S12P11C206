package com.ssafy.backend.tale.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * author : HEO-hyunjun
 * date : 2025.02.06
 * description : 제작된 동화 응답 DTO
 * update :
 *  1. basetale Id 추가
 */

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TaleResponseDto {
    long taleId;
    long baseTaleId;
    String img;
    String title;
    String createdAt;
}
