package com.ssafy.backend.db.repository;

import com.ssafy.backend.db.entity.Member;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {
    Optional<Member> findById(Integer Id);
    Optional<Member> findByLoginId(String loginId);
    boolean existsByLoginId(String loginId);
    Optional<Member> findByEmail(String email);

    @Query("SELECT m FROM Member m WHERE m.loginId = :loginId AND m.isDeleted=false ")
    Optional<Member> getMemberByLoginIdEquals(String loginId);
    @Modifying
    @Transactional
    @Query("UPDATE Member m SET m.isDeleted=true WHERE m.loginId = :loginId AND m.isDeleted=false  ")
    int softDeleteByLoginId(String loginId);
    Optional<Member> findByNickname(String email);
    Optional<Member> findByEmailAndBirth(String email, String birth);
}
