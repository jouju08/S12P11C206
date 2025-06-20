package com.ssafy.backend.db.repository;

import com.ssafy.backend.db.entity.Gallery;
import com.ssafy.backend.db.entity.GalleryLike;
import com.ssafy.backend.db.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GalleryLikeRepository extends JpaRepository<GalleryLike, Long> {
    @Query("SELECT g FROM GalleryLike g WHERE g.member = :member AND g.gallery = :gallery")
    Optional<GalleryLike> findByMemberAndGallery(@Param("member") Member member, @Param("gallery") Gallery gallery);
    Optional<GalleryLike> findByGalleryIdAndMemberId(Long galleryId, Long memberId);
    @Modifying
    @Query("DELETE FROM GalleryLike g WHERE (g.galleryId = :galleryId) and (g.memberId = :memberId)")
    void deleteByGalleryIdAndMemberId(Long galleryId, Long memberId);

    List<GalleryLike> findByGalleryId(Long galleryId);
}
