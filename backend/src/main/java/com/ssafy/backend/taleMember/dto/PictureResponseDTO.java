package com.ssafy.backend.taleMember.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

/**
 * author : lee youngjae
 * date : 2025.02.10
 * description : 그림 응답을 위한 DTO
 */

@Getter
@Setter
@Builder
@AllArgsConstructor
public class PictureResponseDTO {
    private Long id;

    private String orginImg;

    private String createdAt;
}
