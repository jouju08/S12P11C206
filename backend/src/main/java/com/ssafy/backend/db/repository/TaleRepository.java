package com.ssafy.backend.db.repository;

import com.ssafy.backend.db.entity.Tale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaleRepository extends JpaRepository<Tale, Long> {
}
