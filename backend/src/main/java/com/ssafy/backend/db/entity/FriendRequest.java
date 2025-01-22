package com.ssafy.backend.db.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "friend_request")
@Data
public class FriendRequest extends Common {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 신청자 (Member)
    @Column(name = "proposer_id", nullable = false)
    private Long proposerId;

    // 수신자 (Member)
    @Column(name = "recipient_id", nullable = false)
    private Long recipientId;

    // 응답(null = 보류/대기)
    private Character response;

    /** 연관관계 매핑 (Member) */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "proposer_id", insertable = false, updatable = false)
    private Member proposerMember;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient_id", insertable = false, updatable = false)
    private Member receiverMember;
}
