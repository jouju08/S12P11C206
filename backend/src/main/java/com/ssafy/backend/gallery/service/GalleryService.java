package com.ssafy.backend.gallery.service;

import com.ssafy.backend.common.exception.ResourceNotFoundException;
import com.ssafy.backend.db.entity.Gallery;
import com.ssafy.backend.db.entity.GalleryLike;
import com.ssafy.backend.db.entity.Member;
import com.ssafy.backend.db.entity.TaleMember;
import com.ssafy.backend.db.repository.GalleryLikeRepository;
import com.ssafy.backend.db.repository.GalleryRepository;
import com.ssafy.backend.db.repository.MemberRepository;
import com.ssafy.backend.db.repository.TaleMemberRepository;
import com.ssafy.backend.gallery.dto.GalleryDto;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GalleryService {
    private final GalleryRepository galleryRepository;
    private final MemberRepository memberRepository;
    private final GalleryLikeRepository galleryLikeRepository;
    private final TaleMemberRepository taleMemberRepository;


    public Page<Gallery> findAllPictures(Pageable pageable) {
        return galleryRepository.findAllPictures(pageable);
    }

    public Optional<Gallery> pictureDetail(Integer id) {
        try {
            Optional<Gallery> result = galleryRepository.findById(id);
            return result;
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Transactional
    public void createBoard(long taleMemberId, String loginId, boolean hasOrigin) {

        // Fetch TaleMember safely. If not found, throw an exception.
        TaleMember taleMember = taleMemberRepository.findById(taleMemberId)
                .orElseThrow(() -> new EntityNotFoundException("TaleMember not found with id: " + taleMemberId));

        // Fetch Member safely.
        Member member = memberRepository.findByLoginId(loginId)
                .orElseThrow(() -> new EntityNotFoundException("Member not found with loginId: " + loginId));

        // Check if the member ID of the logged-in user matches the one in TaleMember
        if (member.getId().longValue() != taleMember.getMember().getId().longValue()) {
            throw new AuthorizationDeniedException("잘못된 회원 접근입니다.");
        }

        // Use the appropriate image path
        String imgPath = hasOrigin ? taleMember.getOrginImg() : taleMember.getImg();

        try {
            galleryRepository.save(Gallery.builder()
                    .hasOrigin(hasOrigin)
                    .imgPath(imgPath)
                    .member(member)
                    .hit(0)
                    .hasDeleted(false)
                    .build());
        } catch (Exception e) {
            throw new RuntimeException("게시글 업로드 실패", e);
        }
    }


    @Transactional
    public boolean like(Authentication auth, GalleryDto galleryDto) {
        if (galleryDto.getHasLiked() == null)
            throw new RuntimeException("잘못된 요청! hasLiked 값을 넣어주세요");

        // 회원 조회 시 값이 없으면
        Member member = memberRepository.findByLoginId(auth.getName())
                .orElseThrow(() -> new EntityNotFoundException("로그인한 사용자를 찾을 수 없습니다."));
        Long memberId = member.getId();

        if (!galleryDto.getHasLiked()) {
            // 좋아요 처리
            galleryLikeRepository.save(GalleryLike.builder()
                    .memberId(memberId)
                    .galleryId(galleryDto.getId())
                    .build());
            return true;
        } else {
            // 좋아요 취소 처리
            System.out.println("memberId = " + memberId);
            System.out.println("galleryDto.getId() = " + galleryDto.getId());
            GalleryLike galleryLike = galleryLikeRepository.findByGalleryIdAndMemberId(galleryDto.getId(), memberId)
                    .orElseThrow(() -> new EntityNotFoundException("좋아요 정보를 찾을 수 없습니다."));
            galleryLikeRepository.delete(galleryLike);
            return false;
        }
    }

}
