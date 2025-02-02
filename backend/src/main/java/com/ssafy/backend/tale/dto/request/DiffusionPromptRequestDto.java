package com.ssafy.backend.tale.dto.request;

import com.ssafy.backend.tale.dto.response.PageInfo;
import lombok.*;

import java.util.List;

/**
 * author : 허현준
 * date : 2025.02.02
 * description : 프롬프트 요청 DTO
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class DiffusionPromptRequestDto {
    private String title;
    List<PageInfo> pages;
}
