package com.ssafy.backend.gallery.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GalleryListResponseDto {
    private Long galleryId;
    private String img;
    private Long authorId;
    private String authorNickname;
    private String authorProfileImg;
    private boolean hasLiked;
    private int likeCnt;
    private String createdAt;
}
