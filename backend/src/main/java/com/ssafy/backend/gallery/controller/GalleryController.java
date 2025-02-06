package com.ssafy.backend.gallery.controller;

import com.ssafy.backend.common.ApiResponse;
import com.ssafy.backend.common.ResponseCode;
import com.ssafy.backend.common.ResponseMessage;
import com.ssafy.backend.common.exception.BadRequestException;
import com.ssafy.backend.common.exception.ResourceNotFoundException;
import com.ssafy.backend.db.entity.Gallery;
import com.ssafy.backend.db.repository.GalleryRepository;
import com.ssafy.backend.db.repository.MemberRepository;
import com.ssafy.backend.db.repository.TaleMemberRepository;
import com.ssafy.backend.gallery.dto.GalleryDto;
import com.ssafy.backend.dto.PictureDto;
import com.ssafy.backend.gallery.dto.GalleryRequestDto;
import com.ssafy.backend.gallery.service.GalleryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;


@Slf4j
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class GalleryController {
    private final GalleryRepository galleryRepository;
    private final TaleMemberRepository taleMemberRepository;

    private final GalleryService galleryService;
    private final MemberRepository memberRepository;


    @PostMapping("/gallery")//게시글 생성
    public ApiResponse<Object> createBoard(Authentication auth, @RequestBody GalleryRequestDto galleryRequestDto) {
        System.out.println(galleryRequestDto);
        galleryService.createBoard(galleryRequestDto.getTaleMemberId(), auth.getName(), galleryRequestDto.isHasOrigin());
        return ApiResponse.builder().build();
    }

    @GetMapping("/gallery/view/my-pictures")//게시판에 올릴 사진을 위해 내 사진 정보들 불러옴
    public ApiResponse<Optional<PictureDto>> viewMyPictures(Authentication auth) {
        User user = (User) auth.getPrincipal();
        Long userId = memberRepository.findByLoginId(user.getUsername()).get().getId();
        Optional<PictureDto> myPictures = taleMemberRepository.findPictureByTaleId(userId);
        if (myPictures.isPresent()) {
            return ApiResponse.<Optional<PictureDto>>builder()
                    .data(myPictures)
                    .build();
        } else
            return ApiResponse.<Optional<PictureDto>>builder().data(Optional.empty()).status(ResponseMessage.SUCCESS).build();
    }

    @GetMapping("/gallery/pictures/all")//모든 게시판 정보 불러오기
    public ApiResponse<Page<Gallery>> getPictures(@RequestParam(defaultValue = "0") int page,
                                                  @RequestParam(defaultValue = "10") int size) {
        try {
            Page<Gallery> allPictures = galleryService.findAllPictures(PageRequest.of(page, size));
            return ApiResponse.<Page<Gallery>>builder()
                    .data(allPictures)
                    .build();
        } catch (ResourceNotFoundException e) {
            return ApiResponse.<Page<Gallery>>builder().message(ResponseMessage.NOT_FOUND).status(ResponseCode.NOT_FOUND).build();
        } catch (Exception e) {
            throw new BadRequestException(e.getMessage());
        }

    }

    @GetMapping("/gallery/{pictureId}/detail")//게시판 디테일 불러오기, 사진 아이디 필요
    public ApiResponse<Optional<Gallery>> getPicturesDetail(@PathVariable Integer pictureId) {
        Optional<Gallery> pictureDetail = galleryService.pictureDetail(pictureId);
        if (pictureDetail.isPresent()) {
            return ApiResponse.<Optional<Gallery>>builder()
                    .data(pictureDetail)
                    .build();
        } else {
            throw new ResourceNotFoundException("picture not found");
        }
    }


    @PostMapping("/gallery/like")
    public ApiResponse<Object> likeBoard(@RequestBody GalleryDto galleryDto, Authentication auth) {
        System.out.println(galleryDto);
        if(galleryService.like(auth, galleryDto)){
            return ApiResponse.builder().data("좋아요").build();
        } else {
            return ApiResponse.builder().data("좋아요 취소").build();
        }
    }
}
