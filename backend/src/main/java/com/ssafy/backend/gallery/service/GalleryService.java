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
import com.ssafy.backend.dto.GalleryDto;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
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

    public Boolean galleryLike(Long galleryId, Long userId) {
        Member member = memberRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        Gallery gallery = galleryRepository.findById(galleryId).orElseThrow(() -> new ResourceNotFoundException("Gallery not found: " + galleryId));
        Optional<GalleryLike> galleryLike = galleryLikeRepository.findByMemberAndGallery(member, gallery);
        if (galleryLike.isPresent()) {//이미 좋아요 눌러져 있어서 취소
            galleryLikeRepository.delete(galleryLike.get());
            return false;
        } else {//좋아요 누르기
            GalleryLike galleryLike1 = new GalleryLike();
            galleryLike1.setGallery(gallery);
            galleryLike1.setMember(member);
            galleryLikeRepository.save(galleryLike1);
            return true;
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


}
