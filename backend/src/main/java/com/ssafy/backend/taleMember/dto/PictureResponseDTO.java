package com.ssafy.backend.taleMember.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class PictureResponseDTO {
    private Long id;

    private String orginImg;

    private String createdAt;
}
