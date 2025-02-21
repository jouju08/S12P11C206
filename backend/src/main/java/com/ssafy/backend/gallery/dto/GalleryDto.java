package com.ssafy.backend.gallery.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * author : park byeongju
 * date : 2025.02.18
 * description : 자랑하기 게시판 dto
 * update
 * 1.
 */

@AllArgsConstructor
@NoArgsConstructor
@Data
public class GalleryDto {
    private Long id;
    private String imgPath;
    private Boolean isOrigin;
    // 좋아요 상태면 true, 아니면 false
    private Boolean hasLiked;
}

