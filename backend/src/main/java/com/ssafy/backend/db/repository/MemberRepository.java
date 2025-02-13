package com.ssafy.backend.db.repository;

import com.ssafy.backend.db.entity.Member;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {
    Optional<Member> findById(Integer Id);

    @Query("select m from Member m where m.loginId=:loginId")
    Optional<Member> findByLoginId(String loginId);

    @Query("select m.isDeleted from Member m where m.loginId = :loginId")
    Boolean existsByLoginId(String loginId);

    @Query("select m from Member m where m.email=:email And m.isDeleted=false")
    Optional<Member> findByEmail(String email);

    @Query("select m from Member m where m.loginId!=:loginId And m.isDeleted=false")
    List<Member> findAllExceptMe(String loginId);

    @Query("SELECT m FROM Member m WHERE m.loginId = :loginId AND m.isDeleted=false ")
    Optional<Member> getMemberByLoginIdEquals(String loginId);
    @Modifying
    @Query("UPDATE Member m SET m.isDeleted=true WHERE m.loginId = :loginId AND m.isDeleted=false  ")
    int softDeleteByLoginId(String loginId);

    @Query("select m from Member m where m.nickname=:nickname And m.isDeleted=false")
    Optional<Member> findByNickname(String nickname);
    Optional<Member> findByEmailAndBirth(String email, String birth);
}
