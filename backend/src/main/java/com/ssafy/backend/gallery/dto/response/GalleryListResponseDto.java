package com.ssafy.backend.gallery.dto.response;

import lombok.*;

/**
 * author : park byeongju
 * date : 2025.02.18
 * description : 자랑하기 게시판 목록을 제공하기 위한 Response DTO
 * update
 * 1.
 */

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
