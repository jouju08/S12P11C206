package com.ssafy.backend.db.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

@Entity
@IdClass(FriendId.class)
@Table(name = "friend")
@Data
public class Friend extends Common {

    @Id
    @Column(name = "member_from_id")
    private Long memberFromId;

    @Id
    @Column(name = "member_to_id")
    private Long memberToId;

    // 실제 Member 객체 참조
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_from_id", insertable = false, updatable = false)
    private Member fromMember;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_to_id", insertable = false, updatable = false)
    private Member toMember;

}
