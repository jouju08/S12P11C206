package com.ssafy.backend.db.repository;

import com.ssafy.backend.db.entity.TaleMember;
import com.ssafy.backend.dto.PictureDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaleMemberRepository extends JpaRepository<TaleMember, Long> {
    TaleMember findByMemberIdAndTaleId(Long memberId, Long taleId);
    TaleMember findByTaleIdAndOrderNum(Long taleId, int order);
    List<TaleMember> findByTaleId(Long taleId);

}
