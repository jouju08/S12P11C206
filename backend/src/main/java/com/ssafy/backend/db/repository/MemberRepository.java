package com.ssafy.backend.db.repository;

import com.ssafy.backend.db.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {
    Optional<Member> findByMemberId(String memberId);
    //Derived query methods
    //특정 문자 포함 검색하기
    Optional<Member> findByEmail(String email);
}
