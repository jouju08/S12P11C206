package com.ssafy.backend.db.repository;

import com.ssafy.backend.db.entity.TaleMember;
import com.ssafy.backend.taleMember.dto.*;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaleMemberRepository extends JpaRepository<TaleMember, Long> {
    TaleMember findByMemberIdAndTaleId(Long memberId, Long taleId);
    TaleMember findByTaleIdAndOrderNum(Long taleId, int order);
    List<TaleMember> findByTaleId(Long taleId);

    Page<TaleMember> findByMemberId(Long memberId, Pageable pageable);

    @Query("SELECT tm FROM TaleMember tm WHERE tm.member.id = :memberId AND tm.tale.baseTale.id = :baseTaleId")
    Page<TaleMember> findByMemberIdAndBaseTaleId(Long memberId, Long baseTaleId, Pageable pageable);

    @Query(value = "SELECT new com.ssafy.backend.taleMember.dto.PictureResponseDTO(" +
            "tm.id, tm.orginImg, tm.createdAt) " +
            "FROM TaleMember tm " +
            "JOIN tm.tale t " +
            "JOIN t.baseTale bt " +
            "WHERE tm.member.id = :memberId " +
            "AND (:filter = '전체보기' OR bt.title = :filter)",
            countQuery = "SELECT COUNT(tm) FROM TaleMember tm " +
                    "JOIN tm.tale t " +
                    "JOIN t.baseTale bt " +
                    "WHERE tm.member.id = :memberId " +
                    "AND (:filter = '전체보기' OR bt.title = :filter)")
    Page<PictureResponseDTO> findPicturesByMemberId(
            @Param("memberId") Long memberId,
            @Param("filter") String filter,
            Pageable pageable);

    @Query("SELECT new com.ssafy.backend.taleMember.dto.PictureDetailResponseDTO(" +
            "tm.id, tm.orginImg, tm.img, tm.createdAt, bt.title, tm.script) " +
            "FROM TaleMember tm " +
            "JOIN tm.tale t " +
            "JOIN t.baseTale bt " +
            "WHERE tm.id = :taleMemberId AND tm.member.id = :memberId")
    Optional<PictureDetailResponseDTO> findPictureDetailByTaleMemberIdAndMemberId(
            @Param("taleMemberId") Long taleMemberId,
            @Param("memberId") Long memberId);

    @Query("SELECT DISTINCT bt.title " +
            "FROM TaleMember tm " +
            "JOIN tm.tale t " +
            "JOIN t.baseTale bt " +
            "WHERE tm.member.id = :memberId")
    List<String> findDistinctPictureTitles(@Param("memberId") Long memberId);
}
