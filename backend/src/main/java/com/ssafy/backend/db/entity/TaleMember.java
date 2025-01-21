package com.ssafy.backend.db.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tale_member")
@Data
public class TaleMember extends Common{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Boolean has_host;

    @Column(length = 20, nullable = false)
    private String keyword;  // 선택 키워드

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

    // Tale N:1
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tale_id", nullable = false)
    private Tale tale;

    // Member N:1
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

}
