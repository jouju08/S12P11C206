package com.ssafy.backend.gallery.dto.request;

import lombok.Getter;
import lombok.ToString;

/**
 * author : park byeongju
 * date : 2025.02.18
 * description : 자랑하기 게시판 Request DTO
 * update
 * 1.
 */

@Getter
@ToString
public class GalleryRequestDto {
    private Long taleMemberId;
    private Long galleryId;
    private boolean hasOrigin;
}
