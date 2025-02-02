package com.ssafy.backend.tale.controller;

import com.ssafy.backend.common.ApiResponse;
import com.ssafy.backend.tale.dto.common.TaleMemberDto;
import com.ssafy.backend.tale.dto.request.GenerateTaleRequestDto;
import com.ssafy.backend.tale.dto.request.KeywordFileRequestDto;
import com.ssafy.backend.tale.dto.request.KeywordRequestDto;
import com.ssafy.backend.tale.dto.request.SubmitFileRequestDto;
import com.ssafy.backend.tale.dto.response.StartTaleMakingResponseDto;
import com.ssafy.backend.tale.service.AIServerRequestService;
import com.ssafy.backend.tale.service.TaleService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
/**
 *  author : HEO-hyunjun
 *  date : 2025.01.31
 *  description : 동화 제작 관련 컨트롤러,
 *  update
 *      1. keyword submit 구현 (2025.02.01)
 * */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/tale")
public class TaleController {
    private final TaleService taleService;
    private final AIServerRequestService aiServerRequestService;

    // 동화 제작 시작
    @GetMapping("/start/{roomId}")
    public ApiResponse<StartTaleMakingResponseDto> startMakingTale(@PathVariable long roomId){
        return ApiResponse.<StartTaleMakingResponseDto>builder()
                .data(taleService.startMakingTale(roomId))
                .build();
    }

    // 키워드 타이핑 정보 확인
    @PostMapping("/keyword/typing")
    public ApiResponse<String> keywordTyping(@RequestBody KeywordRequestDto keywordRequestDto){
        return ApiResponse.<String>builder().data(keywordRequestDto.getKeyword()).build();
    }

    // todo : 키워드 음성 정보 확인
    @PostMapping("/keyword/voice")
    public ApiResponse<String> keywordVoice(@RequestBody KeywordFileRequestDto keywordFileRequestDto){
        return ApiResponse.<String>builder().data("keyword.getKeyword()").build();
    }

    // todo : 키워드 손글씨 정보 확인
    @PostMapping("/keyword/handwrite")
    public ApiResponse<String> keywordHandwrite(@RequestBody KeywordFileRequestDto keywordFileRequestDto){
        return ApiResponse.<String>builder().data("keyword.getKeyword()").build();
    }

    // 키워드 최종선택
    @PostMapping("/submit/keyword")
    public ApiResponse<String> keywordSubmit(@RequestBody KeywordRequestDto keywordRequestDto){
        // todo : 키워드 선택 후 처리
        // 1. 레디스에 키워드 저장
        // 2. 단어 몇명 선택했는지 확인
        // 3. 모두 선택했으면 다음 단계로 넘어가기 -> websocket으로 알림 + 동화 생성
        // 4. 일단 응답은 ok
        if(taleService.keywordSubmit(keywordRequestDto) >= 4){
            // todo : 다음 단계로 넘어가기
            // ai 쪽으로 동화 생성 요청
            GenerateTaleRequestDto generateTaleRequestDto = taleService.getGenerateTaleInfo(keywordRequestDto.getRoomId());
            aiServerRequestService.requestGenerateTale(keywordRequestDto.getRoomId(), generateTaleRequestDto);
        }
        return ApiResponse.<String>builder().build();
    }

    // todo : 동화 손그림 제출
    @PostMapping("/submit/picture")
    public ApiResponse<String> submitHandPicture(@RequestBody SubmitFileRequestDto submitFileRequestDto){
        if(taleService.saveHandPicture(submitFileRequestDto) >= 4){
            // todo: 4명이 모두 그림을 제출했을 때,
            //  1. tale_member들을 mysql에 저장
            //  2. ai 쪽으로 그림 생성 요청
            //  3. 동화 완성을 websocket으로 알림
            aiServerRequestService.requestAIPicture(submitFileRequestDto.getRoomId());
        }
        
        return ApiResponse.<String>builder().build();
    }

    // todo : 햇동화 요청
    @GetMapping("/temp/{roomId}/{page}")
    public ApiResponse<TaleMemberDto> getTempTale(@PathVariable long roomId, @PathVariable int page){
        return ApiResponse.<TaleMemberDto>builder().data(taleService.getTaleMemberDtoFromRedis(roomId,page)).build();
    }
    // todo : 햇동화 다읽음
    @GetMapping("/temp/end/{roomId}")
    public ApiResponse<String> submitScriptVoice(@PathVariable long roomId){
        return ApiResponse.<String>builder().data(Long.toString(roomId)).build();
    }
}
