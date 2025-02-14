package com.ssafy.backend.db.repository;

import com.ssafy.backend.db.entity.ParentBaseTale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParentBaseTaleRepository extends JpaRepository<ParentBaseTale, Long> {
    List<ParentBaseTale> findByMemberId(Long memberId);
    List<ParentBaseTale> findByMemberIdAndHasApproved(Long memberId, boolean hasApproved);
    List<ParentBaseTale> findByHasApproved(boolean hasApproved);
}
