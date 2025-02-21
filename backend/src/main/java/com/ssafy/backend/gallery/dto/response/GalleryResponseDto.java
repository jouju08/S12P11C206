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
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GalleryResponseDto {
    private Long galleryId;
    private String taleTitle;
    private String img;
    private String originImg;

    private String author;
    private Long authorMemberId;
    private String authorProfileImg;
    private Long taleId;

    private String sentence;

    private Long baseTaleId;

    private int likeCount;
    private boolean hasOrigin;
    private boolean hasLiked;

    private String createdAt;
}
