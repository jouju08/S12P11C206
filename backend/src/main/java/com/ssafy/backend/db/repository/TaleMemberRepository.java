package com.ssafy.backend.db.repository;

import com.ssafy.backend.db.entity.TaleMember;
import com.ssafy.backend.dto.PictureDto;
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

    Optional<PictureDto> findPictureByTaleId(Long userId);

    List<TaleMember> findByMemberId(Long memberId);

    @Query("SELECT tm FROM TaleMember tm WHERE tm.member.id = :memberId AND tm.tale.baseTale.id = :baseTaleId")
    Page<TaleMember> findByMemberIdAndBaseTaleId(Long memberId, Long baseTaleId, Pageable pageable);

    Page<TaleMember> findByMemberId(Long memberId, Pageable pageable);
}
