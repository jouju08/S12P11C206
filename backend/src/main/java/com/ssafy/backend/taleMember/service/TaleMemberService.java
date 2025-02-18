package com.ssafy.backend.taleMember.service;

import com.ssafy.backend.db.repository.MemberRepository;
import com.ssafy.backend.db.repository.TaleMemberRepository;
import org.springframework.data.domain.Sort;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Service;
import com.ssafy.backend.taleMember.dto.*;

import java.util.List;

/**
 * author : lee youngjae
 * date : 2025.02.10
 * description : Tale member service
 */

@Service
@RequiredArgsConstructor
public class TaleMemberService {

    private final TaleMemberRepository taleMemberRepository;
    private final MemberRepository memberRepository;

    @Transactional(readOnly = true)
    public Page<PictureResponseDTO> viewMyPictures(User user, int page, int size, String sort, String filter) {
        Long memberId = memberRepository.findByLoginId(user.getUsername()).
                get().getId();
        Pageable pageable;

        if ("최신순".equals(sort)) {
            pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        } else if ("과거순".equals(sort)) {
            pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "createdAt"));
        } else { // "전체보기" 등의 기본값
            pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        }
        return taleMemberRepository.findPicturesByMemberId(memberId, filter, pageable);
    }

    @Transactional(readOnly = true)
    public PictureDetailResponseDTO getPictureDetail(User user, Long taleMemberId) {
        Long memberId = memberRepository.findByLoginId(user.getUsername()).
                get().getId();

        return taleMemberRepository.findPictureDetailByTaleMemberIdAndMemberId(
                taleMemberId,
                memberId
        ).orElseThrow(() -> new RuntimeException("Picture detail not found"));
    }

    @Transactional(readOnly = true)
    public List<String> getDistinctPictureTitles(User user) {
        Long memberId = memberRepository.findByLoginId(user.getUsername()).
                get().getId();
        return taleMemberRepository.findDistinctPictureTitles(memberId);
    }
}
