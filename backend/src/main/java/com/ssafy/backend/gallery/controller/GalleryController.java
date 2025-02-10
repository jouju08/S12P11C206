package com.ssafy.backend.gallery.controller;

import com.ssafy.backend.common.ApiResponse;
import com.ssafy.backend.common.ResponseCode;
import com.ssafy.backend.common.ResponseMessage;
import com.ssafy.backend.common.exception.BadRequestException;
import com.ssafy.backend.common.exception.ResourceNotFoundException;
import com.ssafy.backend.db.repository.GalleryRepository;
import com.ssafy.backend.db.repository.TaleMemberRepository;
import com.ssafy.backend.gallery.dto.*;
import com.ssafy.backend.gallery.service.GalleryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;


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
        System.out.println(galleryRequestDto);
        galleryService.createBoard(galleryRequestDto.getTaleMemberId(), auth.getName(), galleryRequestDto.isHasOrigin());
        return ApiResponse.builder().build();
    }

    @GetMapping("/gallery")//모든 게시판 정보 불러오기
    public ApiResponse<List<GalleryListResponseDto>> getPictures(Authentication auth) {
        try {
            List<GalleryListResponseDto> allPictures = galleryService.findAllPictures(auth);
            return ApiResponse.<List<GalleryListResponseDto>>builder()
                    .data(allPictures)
                    .build();
        } catch (ResourceNotFoundException e) {
            return ApiResponse.<List<GalleryListResponseDto>>builder().message(ResponseMessage.NOT_FOUND).status(ResponseCode.NOT_FOUND).build();
        } catch (Exception e) {
            throw new BadRequestException(e.getMessage());
        }

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
        System.out.println(galleryDto);
        if(galleryService.like(auth, galleryDto)){
            return ApiResponse.builder().data("좋아요").build();
        } else {
            return ApiResponse.builder().data("좋아요 취소").build();
        }
    }
}
