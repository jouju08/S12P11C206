package com.ssafy.backend.db.entity;

import java.io.Serializable;
import java.util.Objects;

/**
 * friend (member_from_id, member_to_id) 복합키
 */
public class FriendId implements Serializable {

    private Long memberFromId;
    private Long memberToId;

    public FriendId() {
    }

    public FriendId(Long memberFromId, Long memberToId) {
        this.memberFromId = memberFromId;
        this.memberToId = memberToId;
    }

    // equals, hashCode 구현
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof FriendId)) return false;
        FriendId friendId = (FriendId) o;
        return Objects.equals(memberFromId, friendId.memberFromId)
                && Objects.equals(memberToId, friendId.memberToId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(memberFromId, memberToId);
    }
}