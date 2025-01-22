package com.ssafy.backend.db.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "gallery")
@Data
public class Gallery extends Common {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int hit;  // 조회수

    @Column(nullable = false)
    private Boolean hasOrigin; // 원본 여부

    @Column(nullable = false)
    private int likeCnt;  // 좋아요 수

    @Column(nullable = false)
    private Boolean hasDeleted = false;

    // Member N:1
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    // GalleryLike (Gallery 1 : N GalleryLike)
    @OneToMany(mappedBy = "gallery", cascade = CascadeType.ALL)
    private List<GalleryLike> galleryLikes = new ArrayList<>();
}
