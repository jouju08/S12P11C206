package com.ssafy.backend.gallery.service;

import com.ssafy.backend.common.exception.NotFoundPage;
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
import com.ssafy.backend.gallery.dto.GalleryListResponseDto;
import com.ssafy.backend.gallery.dto.GalleryRequestDto;
import com.ssafy.backend.gallery.dto.GalleryResponseDto;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.InvalidDataAccessApiUsageException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GalleryService {
    private final GalleryRepository galleryRepository;
    private final MemberRepository memberRepository;
    private final GalleryLikeRepository galleryLikeRepository;
    private final TaleMemberRepository taleMemberRepository;

    private final int PAGE_SIZE = 8;


    /*
     * “date” - 최신순(기본값)
     *
     * “famous” - 인기순
     */
    @Transactional
    public List<GalleryListResponseDto> findAllPictures(Authentication auth, int page, String order) {
        Long userId = memberRepository.findByLoginId(auth.getName()).get().getId();
        List<GalleryListResponseDto> result = new ArrayList<GalleryListResponseDto>();

        Pageable pageable = PageRequest.of(page, 8);
        System.out.println("page = " + page);
        System.out.println("order = " + order);

        try {
            Page<Gallery> galleryPage = galleryRepository.findAllPictures(order.toUpperCase(), pageable);
            boolean hasLiked = true;

            for (Gallery gallery : galleryPage) {
                Optional<GalleryLike> galleryLike = galleryLikeRepository.findByGalleryIdAndMemberId(gallery.getId(), userId);
                if(galleryLike.isPresent()) {
                    hasLiked = true;
                } else {
                    hasLiked = false;
                }
                GalleryListResponseDto dto = new GalleryListResponseDto();
                dto.setGalleryId(gallery.getId());
                dto.setImg(gallery.getImgPath());
                dto.setAuthorId(gallery.getMember().getId());
                dto.setAuthorNickname(gallery.getMember().getNickname());
                dto.setAuthorProfileImg(gallery.getMember().getProfileImg());
                dto.setLikeCnt(gallery.getLikeCnt());
                dto.setCreatedAt(gallery.getCreatedAt());
                dto.setHasLiked(hasLiked);
                result.add(dto);
            }

            return result;
        } catch (InvalidDataAccessApiUsageException e){
//            e.printStackTrace();
            throw new NotFoundPage("없는 페이지입니다.");
        }
    }

    @Transactional
    public GalleryResponseDto pictureDetail(Authentication auth, Integer id) {
        try {
            Optional<Gallery> gallery = galleryRepository.findById(id);
            if (gallery.get().getHasDeleted()) {
                throw new ResourceNotFoundException("삭제된 게시글에 대한 요청입니다.");
            }
            int orderNum = gallery.get().getTaleMember().getOrderNum();
            String keyword = "";
            String sentence = "";
            if(orderNum == 0){
                keyword = gallery.get().getTaleMember().getTale().getBaseTale().getKeyword1();
                sentence = gallery.get().getTaleMember().getTale().getBaseTale().getKeywordSentence1();
            } else if(orderNum == 1){
                keyword = gallery.get().getTaleMember().getTale().getBaseTale().getKeyword2();
                sentence = gallery.get().getTaleMember().getTale().getBaseTale().getKeywordSentence2();
            } else if(orderNum == 2){
                keyword = gallery.get().getTaleMember().getTale().getBaseTale().getKeyword3();
                sentence = gallery.get().getTaleMember().getTale().getBaseTale().getKeywordSentence3();
            } else if(orderNum == 3){
                keyword = gallery.get().getTaleMember().getTale().getBaseTale().getKeyword4();
                sentence = gallery.get().getTaleMember().getTale().getBaseTale().getKeywordSentence4();
            }

//            String replaceSentence = sentence.replace("xx", keyword);

            boolean hasLiked = !galleryLikeRepository.findByGalleryIdAndMemberId(gallery.get().getId(), memberRepository.findByLoginId(auth.getName()).get().getId()).isEmpty();
            return GalleryResponseDto.builder()
                    .galleryId(gallery.get().getId())
                    .taleTitle(gallery.get().getTaleMember().getTale().getBaseTale().getTitle())
                    .img(gallery.get().getTaleMember().getImg())
                    .originImg(gallery.get().getTaleMember().getOrginImg())
                    .likeCount(gallery.get().getGalleryLikes().size())
                    .hasOrigin(gallery.get().getHasOrigin())
                    .hasLiked(hasLiked)
                    .author(gallery.get().getMember().getNickname())
                    .authorMemberId(gallery.get().getMember().getId())
                    .authorProfileImg(gallery.get().getMember().getProfileImg())
                    .taleId(gallery.get().getTaleMember().getTale().getId())
                    .baseTaleId(gallery.get().getTaleMember().getTale().getBaseTale().getId())
                    .sentence(gallery.get().getTaleMember().getImgScript())
                    .createdAt(gallery.get().getTaleMember().getCreatedAt())
                    .build();
        } catch (Exception e) {
            return null;
        }
    }

    @Transactional
    public void createBoard(long taleMemberId, String loginId, boolean hasOrigin) {

        TaleMember taleMember = taleMemberRepository.findById(taleMemberId)
                .orElseThrow(() -> new EntityNotFoundException("TaleMember not found with id: " + taleMemberId));

        Member member = memberRepository.findByLoginId(loginId)
                .orElseThrow(() -> new EntityNotFoundException("Member not found with loginId: " + loginId));

        if (member.getId().longValue() != taleMember.getMember().getId().longValue()) {
            throw new AuthorizationDeniedException("잘못된 회원 접근입니다.");
        }

        String imgPath = hasOrigin ? taleMember.getOrginImg() : taleMember.getImg();

        try {
            galleryRepository.save(Gallery.builder()
                    .taleMember(taleMember)
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
            System.out.println("좋아요 처리");
            // 좋아요 처리
            galleryLikeRepository.save(GalleryLike.builder()
                    .memberId(memberId)
                    .galleryId(galleryDto.getId())
                    .build());
            Optional<Gallery> gallery = galleryRepository.findById(galleryDto.getId());
            List<GalleryLike> galleryLike = galleryLikeRepository.findByGalleryId((gallery.get().getId()));
            int likeCount = galleryLike.size();
            gallery.get().setLikeCnt(likeCount);
            return true;
        } else {
            // 좋아요 취소 처리
            galleryLikeRepository.deleteByGalleryIdAndMemberId(galleryDto.getId(), memberId);

            Optional<Gallery> gallery = galleryRepository.findById(galleryDto.getId());
            List<GalleryLike> galleryLike = galleryLikeRepository.findByGalleryId((gallery.get().getId()));
            int likeCount = galleryLike.size();
            gallery.get().setLikeCnt(likeCount);
            return false;
        }
    }

    @Transactional
    public void delete(Authentication auth, GalleryRequestDto galleryRequestDto) {
        Optional<Gallery> gallery = galleryRepository.findById(galleryRequestDto.getGalleryId());
        if (gallery.get().getMember().getId() == memberRepository.findByLoginId(auth.getName()).get().getId()) {
            throw new AuthorizationDeniedException("삭제 권한이 없습니다.");
        }
        gallery.get().setHasDeleted(true);
    }
}
