package com.ssafy.backend.gallery.dto;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public class GalleryRequestDto {
    private Long taleMemberId;
    private boolean hasOrigin;
}
