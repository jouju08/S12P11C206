package com.ssafy.backend.gallery.controller;

import com.ssafy.backend.common.dto.ApiResponse;
import com.ssafy.backend.common.exception.ResourceNotFoundException;
import com.ssafy.backend.db.repository.GalleryRepository;
import com.ssafy.backend.db.repository.TaleMemberRepository;
import com.ssafy.backend.gallery.dto.*;
import com.ssafy.backend.gallery.dto.request.GalleryRequestDto;
import com.ssafy.backend.gallery.dto.response.GalleryListResponseDto;
import com.ssafy.backend.gallery.dto.response.GalleryResponseDto;
import com.ssafy.backend.gallery.service.GalleryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * author : park byeongju
 * date : 2025.02.18
 * description : 자랑하기 게시판 컨트롤러
 * update
 * 1.
 */

@Slf4j
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class GalleryController {
    private final GalleryRepository galleryRepository;
    private final TaleMemberRepository taleMemberRepository;

    private final GalleryService galleryService;

    @PostMapping("/gallery")//게시글 생성
    public ApiResponse<Object> createBoard(Authentication auth, @RequestBody GalleryRequestDto galleryRequestDto) {
        galleryService.createBoard(galleryRequestDto.getTaleMemberId(), auth.getName(), galleryRequestDto.isHasOrigin());
        return ApiResponse.builder().build();
    }

    @GetMapping("/gallery")
    public ApiResponse<List<GalleryListResponseDto>> getPictures(
            Authentication auth,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "LATEST") String order,
            @RequestParam(defaultValue = "true" ) Boolean hasOrigin)  {
        List<GalleryListResponseDto> allPictures = galleryService.findAllPictures(auth, --page, order, hasOrigin);
        return ApiResponse.<List<GalleryListResponseDto>>builder()
                .data(allPictures)
                .build();

    }

    @DeleteMapping("/gallery")
    public ApiResponse deletePicture(Authentication auth, @RequestParam GalleryRequestDto galleryRequestDto) {
        galleryService.delete(auth, galleryRequestDto);
        return ApiResponse.builder().build();
    }

    @GetMapping("/gallery/detail")//게시판 디테일 불러오기, 사진 아이디 필요
    public ApiResponse<GalleryResponseDto> getPicturesDetail(Authentication auth, @RequestParam Integer id) {
        GalleryResponseDto pictureDetail = galleryService.pictureDetail(auth, id);
        if (pictureDetail != null) {
            return ApiResponse.<GalleryResponseDto>builder()
                    .data(pictureDetail)
                    .build();
        } else {
            throw new ResourceNotFoundException("picture not found");
        }
    }


    @PostMapping("/gallery/like")
    public ApiResponse<Object> likeBoard(@RequestBody GalleryDto galleryDto, Authentication auth) {
        if(galleryService.like(auth, galleryDto)){
            return ApiResponse.builder().data("좋아요").build();
        } else {
            return ApiResponse.builder().data("좋아요 취소").build();
        }
    }
}
