package com.ssafy.backend.tale.dto.response;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * author : park byeongju
 * date : 2025.01.31
 * description : 기본 동화 데이터를 담는 DTO
 */

@Getter
@Setter
@ToString
public class BaseTaleResponseDto {
    Long id;
    String title;
    String titleImg;
}
