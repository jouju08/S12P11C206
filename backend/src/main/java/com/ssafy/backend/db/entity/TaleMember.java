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

    @Column(length = 20, nullable = false)
    private String keyword;  // 선택 키워드

    // Tale N:1
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tale_id", nullable = false)
    private Tale tale;

    // Member N:1
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    // TalePage (TaleMember 1 : N TalePage)
    @OneToMany(mappedBy = "taleMember", cascade = CascadeType.ALL)
    private List<TalePage> talePages = new ArrayList<>();
}
