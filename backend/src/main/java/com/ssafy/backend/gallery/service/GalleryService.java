package com.ssafy.backend.gallery.service;

import com.ssafy.backend.common.exception.ResourceNotFoundException;
import com.ssafy.backend.db.entity.Gallery;
import com.ssafy.backend.db.entity.GalleryLike;
import com.ssafy.backend.db.entity.Member;
import com.ssafy.backend.db.repository.GalleryLikeRepository;
import com.ssafy.backend.db.repository.GalleryRepository;
import com.ssafy.backend.db.repository.MemberRepository;
import com.ssafy.backend.dto.GalleryDto;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GalleryService {
    private final GalleryRepository galleryRepository;
    private final MemberRepository memberRepository;
    private final GalleryLikeRepository galleryLikeRepository;

    public GalleryService(GalleryRepository galleryRepository, MemberRepository memberRepository, GalleryLikeRepository galleryLikeRepository) {
        this.galleryRepository = galleryRepository;
        this.memberRepository = memberRepository;
        this.galleryLikeRepository = galleryLikeRepository;
    }

    public Page<Gallery> findAllPictures(Pageable pageable) {
        return galleryRepository.findAllPictures(pageable);
    }

    public Optional<Gallery> pictureDetail(Integer id) {
        try{
            Optional<Gallery> result=galleryRepository.findById(id);
            return result;
        }catch(Exception e){
            return Optional.empty();
        }
    }

    public Boolean galleryLike(Long galleryId, Long userId) {
        Member member = memberRepository.findById(userId)
                .orElseThrow(()->new ResourceNotFoundException("User not found: "+ userId));
        Gallery gallery = galleryRepository.findById(galleryId).orElseThrow(()->new ResourceNotFoundException("Gallery not found: "+ galleryId));
        Optional<GalleryLike> galleryLike=galleryLikeRepository.findByMemberAndGallery(member, gallery);
        if(galleryLike.isPresent()){//이미 좋아요 눌러져 있어서 취소
            galleryLikeRepository.delete(galleryLike.get());
            return false;
        }
        else{//좋아요 누르기
            GalleryLike galleryLike1=new GalleryLike();
            galleryLike1.setGallery(gallery);
            galleryLike1.setMember(member);
            galleryLikeRepository.save(galleryLike1);
            return true;
        }
    }


}
