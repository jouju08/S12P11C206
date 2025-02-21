package com.ssafy.backend.taleMember.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

/**
 * author : lee youngjae
 * date : 2025.02.10
 * description : 그림 상세 응답을 위한 DTO
 */

@Getter
@Setter
@Builder
public class PictureDetailResponseDTO {
    private Long id;

    private String orginImg;

    private String img;

    private String createdAt;

    private String title;

    private String imgScript;
}
