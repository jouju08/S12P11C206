package com.ssafy.backend.tale.dto.response;

import lombok.*;

import java.util.List;

/**
 * author: HEO-hyunjun
 * date: 2025.01.31
 * description: 동화 생성 응답 DTO
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class GenerateTaleResponseDto {
    private List<PageInfo> pages;
}
