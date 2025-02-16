package com.ssafy.backend.taleMember.controller;

import com.ssafy.backend.common.ResponseCode;
import com.ssafy.backend.tale.service.AIServerRequestService;
import com.ssafy.backend.taleMember.dto.*;
import com.ssafy.backend.common.ApiResponse;
import com.ssafy.backend.taleMember.service.TaleMemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/talemember")
public class TaleMemberController {

    private  final TaleMemberService taleMemberService;
    private final AIServerRequestService aiServerRequestService;
    @GetMapping("/view/my-pictures")
    public ApiResponse<Page<PictureResponseDTO>> viewMyPictures(
            Authentication auth,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "전체보기") String sort,
            @RequestParam(defaultValue = "전체보기") String filter) {
        User user = (User) auth.getPrincipal();
        Page<PictureResponseDTO> myPictures = taleMemberService.viewMyPictures(user, page, size, sort, filter);

        return ApiResponse.<Page<PictureResponseDTO>>builder()
                .data(myPictures)
                .build();
    }

    @GetMapping("/view/picture-detail")
    public ApiResponse<PictureDetailResponseDTO> getPictureDetail(
            Authentication auth,
            @RequestParam("taleMemberId") Long taleMemberId) {
        User user = (User) auth.getPrincipal();
        PictureDetailResponseDTO detail = taleMemberService.getPictureDetail(user, taleMemberId);
        return ApiResponse.<PictureDetailResponseDTO>builder()
                .data(detail)
                .build();
    }

    @GetMapping("/view/picture-titles")
    public ApiResponse<List<String>> viewPictureTitles(Authentication auth) {
        User user = (User) auth.getPrincipal();
        List<String> titles = taleMemberService.getDistinctPictureTitles(user);
        return ApiResponse.<List<String>>builder()
                .data(titles)
                .build();
    }

    // 동화 손그림 재제출
    // 그림이 잘못됐을 경우, 그림 생성을 다시 요청합니다.
    @GetMapping("/resubmit/picture/{taleMemberId}")
    public ApiResponse<String> resubmitHandPicture(@PathVariable Long taleMemberId){
        if(aiServerRequestService.isAIPictureServerAlive().getData()){ // 그림생성 AI 서버가 켜져있을 경우
            aiServerRequestService.rerequestAIPicture(taleMemberId); // ai 쪽으로 그림 생성 요청
        }else{
            return ApiResponse.<String>builder().status(ResponseCode.NO_PERMISSION).data("AI 서버가 꺼져있습니다.").build();
        }

        return ApiResponse.<String>builder().build();
    }
}
