package com.ssafy.backend.db.repository;

import com.ssafy.backend.db.entity.Gallery;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GalleryRepository extends JpaRepository<Gallery, Long> {

    Optional<Gallery> findById(Integer id);

    @Query("SELECT g FROM Gallery g WHERE g.hasDeleted = false")
    List<Gallery> findAllPictures();
}
