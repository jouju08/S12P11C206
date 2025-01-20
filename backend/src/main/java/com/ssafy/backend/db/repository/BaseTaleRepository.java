package com.ssafy.backend.db.repository;

import com.ssafy.backend.db.entity.BaseTale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BaseTaleRepository extends JpaRepository<BaseTale, Long> {
}
