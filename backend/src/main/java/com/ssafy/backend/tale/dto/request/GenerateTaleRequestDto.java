package com.ssafy.backend.tale.dto.request;

import lombok.*;

import java.util.List;

/**
 * author : 허현준
 * date: 2025.02.02
 * description: 동화 생성을 위한 요청 DTO
 * update:
 * 1.
 */

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class GenerateTaleRequestDto {
    private String title;
    private String introduction;
    private List<String> sentences;
}
