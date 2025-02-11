package com.ssafy.backend.taleMember.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

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
