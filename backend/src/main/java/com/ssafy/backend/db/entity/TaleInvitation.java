package com.ssafy.backend.db.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "tale_invitation")
@Data
public class TaleInvitation extends Common {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, columnDefinition = "CHAR(1) DEFAULT 'E'") // W : wait, D : Deny ,A : accept
    private Character status;

    // 수신자 (Member)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiver_id", nullable = false)
    private Member receiver;

    // 발신자 (Member)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", nullable = false)
    private Member senderMember;

    // Tale (동화방)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tale_id", nullable = false)
    private Tale tale;
}
