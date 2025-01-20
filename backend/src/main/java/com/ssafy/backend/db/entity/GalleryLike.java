package com.ssafy.backend.db.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "gallery_like")
@Data
@IdClass(GalleryLikeId.class)
public class GalleryLike extends Common{

    @Id
    @Column(name = "gallery_id")
    private Long galleryId;

    @Id
    @Column(name = "member_id")
    private Long memberId;

    // Gallery N:1
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "gallery_id", insertable = false, updatable = false)
    private Gallery gallery;

    // Member N:1
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", insertable = false, updatable = false)
    private Member member;
}
