package com.ssafy.backend.db.repository;

import com.ssafy.backend.db.entity.TaleMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaleMemberRepository extends JpaRepository<TaleMember, Long> {
}
