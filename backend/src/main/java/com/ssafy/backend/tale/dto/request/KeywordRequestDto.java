package com.ssafy.backend.tale.dto.request;

import lombok.Data;

/**
 * author : 허현준
 * date: 2025.02.02
 * description: 키워드 생성을 위한 요청 DTO
 * update:
 * 1. order 추가
 */
@Data
public class KeywordRequestDto {
    private int order;
    private Long memberId;
    private Long roomId;
    private String keyword;
}
