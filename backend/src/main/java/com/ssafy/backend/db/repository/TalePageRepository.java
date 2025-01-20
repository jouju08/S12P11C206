package com.ssafy.backend.db.repository;

import com.ssafy.backend.db.entity.TalePage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TalePageRepository extends JpaRepository<TalePage, Long> {
}
