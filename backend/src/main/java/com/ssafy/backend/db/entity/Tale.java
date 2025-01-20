package com.ssafy.backend.db.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@Table(name = "tale")
public class Tale extends Common{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "parti_cnt")
    private int partiCnt; // 참여자 수

    // BaseTale N:1
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "base_tale_id", nullable = false)
    private BaseTale baseTale;

    // TaleMember (Tale 1 : N TaleMember)
    @OneToMany(mappedBy = "tale", cascade = CascadeType.ALL)
    private List<TaleMember> taleMembers = new ArrayList<>();

    // TaleInvitation (Tale 1 : N TaleInvitation)
    @OneToMany(mappedBy = "tale", cascade = CascadeType.ALL)
    private List<TaleInvitation> invitations = new ArrayList<>();
}
