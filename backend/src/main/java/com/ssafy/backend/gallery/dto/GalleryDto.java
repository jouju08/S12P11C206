package com.ssafy.backend.gallery.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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

