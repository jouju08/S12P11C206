package com.ssafy.backend.db.entity;

import java.io.Serializable;
import java.util.Objects;

public class GalleryLikeId implements Serializable {

    private Long galleryId;
    private Long memberId;

    public GalleryLikeId() {
    }

    public GalleryLikeId(Long galleryId, Long memberId) {
        this.galleryId = galleryId;
        this.memberId = memberId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof GalleryLikeId)) return false;
        GalleryLikeId that = (GalleryLikeId) o;
        return Objects.equals(galleryId, that.galleryId) &&
                Objects.equals(memberId, that.memberId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(galleryId, memberId);
    }
}
