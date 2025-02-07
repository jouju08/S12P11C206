package com.ssafy.backend.gallery.dto;

import lombok.*;
import org.checkerframework.checker.units.qual.A;

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
    private Long taleId;

    private Long baseTaleId;

    private int likeCount;
    private boolean hasOrigin;
    private boolean hasLiked;
}
