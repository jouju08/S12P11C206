package com.ssafy.backend.tale.dto.response;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * author : heo hyunjun
 * date : 2025.01.31
 * description : 부모 동화 정보 제공을 위한 응답 DTO
 */

@Getter
@Setter
@ToString
public class ParentBaseTaleResponseDto {
    Long id;
    String title;
    String titleImg;
    boolean hasApproved;
}
