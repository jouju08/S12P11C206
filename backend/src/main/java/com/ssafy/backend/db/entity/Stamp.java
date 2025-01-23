package com.ssafy.backend.db.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "stamp")
@Data
public class Stamp extends Common {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 10, nullable = false)
    private String name;

    @Column(length = 255, nullable = false)
    private String img;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;
}
