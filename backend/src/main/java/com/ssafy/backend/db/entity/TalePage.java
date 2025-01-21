package com.ssafy.backend.db.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "tale_page")
@Data
public class TalePage extends Common{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "orderNum", nullable = false)
    private int orderNum;  // 페이지 순서

    @Column(length = 255)
    private String orginImg;   // 삽화 원본 이미지

    @Column(length = 255)
    private String img;        // 삽화 이미지

    @Column(length = 255)
    private String voice;      // 나레이션 음성

    @Lob
    private String script;     // 스크립트

    // TaleMember N:1
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tale_member_id", nullable = false)
    private TaleMember taleMember;
}
