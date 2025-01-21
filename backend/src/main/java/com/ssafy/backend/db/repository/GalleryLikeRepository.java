package com.ssafy.backend.db.repository;

import com.ssafy.backend.db.entity.GalleryLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GalleryLikeRepository extends JpaRepository<GalleryLike, Long> {
}
