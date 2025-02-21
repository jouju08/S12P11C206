package com.ssafy.backend.db.repository;

import com.ssafy.backend.db.entity.Gallery;
import com.ssafy.backend.db.entity.Member;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GalleryRepository extends JpaRepository<Gallery, Long> {

    Optional<Gallery> findById(Integer id);

    @Query("SELECT g FROM Gallery g WHERE g.hasDeleted = false ORDER BY g.createdAt desc")
    List<Gallery> findAllPictures_();

    @Query(value = "SELECT g FROM Gallery g WHERE g.hasDeleted = false AND g.hasOrigin = :hasOrigin " +
            "ORDER BY " +
            "CASE WHEN :order = 'LATEST' THEN g.createdAt END DESC, " +
            "CASE WHEN :order = 'POP' THEN g.likeCnt END DESC",
            countQuery = "SELECT COUNT(g) FROM Gallery g WHERE g.hasDeleted = false")
    Page<Gallery> findAllPictures(@Param("order") String order, @Param("hasOrigin") Boolean hasOrigin, Pageable pageable);

    List<Gallery> findByMemberAndImgPathAndCreatedAtStartingWith(Member member, String imgPath, String createdAtPrefix);
}
