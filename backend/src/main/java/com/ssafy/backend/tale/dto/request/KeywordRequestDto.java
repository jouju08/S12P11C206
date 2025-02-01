package com.ssafy.backend.tale.dto.request;

import lombok.Data;

@Data
public class KeywordRequestDto {
    private Long memberId;
    private Long roomId;
    private String keyword;
}
