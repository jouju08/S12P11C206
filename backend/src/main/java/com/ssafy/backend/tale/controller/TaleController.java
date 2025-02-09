package com.ssafy.backend.tale.controller;

import com.ssafy.backend.common.ApiResponse;
import com.ssafy.backend.common.WebSocketNotiService;
import com.ssafy.backend.tale.dto.request.GenerateTaleRequestDto;
import com.ssafy.backend.tale.dto.request.KeywordFileRequestDto;
import com.ssafy.backend.tale.dto.request.KeywordRequestDto;
import com.ssafy.backend.tale.dto.request.SubmitFileRequestDto;
import com.ssafy.backend.tale.dto.response.StartTaleMakingResponseDto;
import com.ssafy.backend.tale.dto.response.TalePageResponseDto;
import com.ssafy.backend.tale.dto.response.TaleResponseDto;
import com.ssafy.backend.tale.dto.response.TextResponseDto;
import com.ssafy.backend.tale.service.AIServerRequestService;
import com.ssafy.backend.tale.service.TaleService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.ssafy.backend.db.repository.MemberRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 *  author : HEO-hyunjun
 *  date : 2025.01.31
 *  description : 동화 제작 관련 컨트롤러,
 *  update
 *      1. keyword submit 구현 (2025.02.01)
 *      2. ai picture submit 구현 / temp tale get 구현 / temp tale end 구현 ai picture submit 구현 (2025.02.01)
 * */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/tale")
public class TaleController {
    private final TaleService taleService;
    private final AIServerRequestService aiServerRequestService;
    private final WebSocketNotiService webSocketNotiService;
    private final MemberRepository memberRepository;

    @GetMapping("/my-tale")
    public ApiResponse<List<TaleResponseDto>> getMyTale(Authentication authentication) {
        String loginId = authentication.getName();
        Long userId=memberRepository.findByLoginId(loginId).get().getId();
        List<TaleResponseDto> taleList= taleService.getByUserId(userId);
        return ApiResponse.<List<TaleResponseDto>>builder().data(taleList).build();
    }

//    //제작한 동화 디테일
//    @GetMapping("/detail/{taleId}")?
//    public ApiResponse<Tale> getDetail(@PathVariable long taleId) {
//        Tale tale=taleService.getByTale(taleId);
//        return ApiResponse.<Tale>builder().data(tale).build();
//    }

    // 동화 제작 시작
    // 방의정보를 보고 동화의 정보를 불러와서 키워드 문장을 매칭시킵니다.
    @GetMapping("/start/{roomId}")
    public ApiResponse<StartTaleMakingResponseDto> startMakingTale(@PathVariable long roomId){
        return ApiResponse.<StartTaleMakingResponseDto>builder()
                .data(taleService.startMakingTale(roomId))
                .build();
    }

    // 키워드 음성 정보 확인
    @PostMapping("/keyword/voice")
    public ApiResponse<TextResponseDto> keywordVoice(@ModelAttribute KeywordFileRequestDto keywordFileRequestDto){
        return aiServerRequestService.requestVoiceKeyword(keywordFileRequestDto);
    }

    //  키워드 손글씨 정보 확인
    @PostMapping("/keyword/handwrite")
    public ApiResponse<TextResponseDto> keywordHandwrite(@ModelAttribute KeywordFileRequestDto keywordFileRequestDto){
        return aiServerRequestService.requestHandWriteKeyword(keywordFileRequestDto);
    }

    // 키워드 타이핑 정보 확인
    @PostMapping("/keyword/typing")
    public ApiResponse<String> keywordTyping(@RequestBody KeywordRequestDto keywordRequestDto){
        return ApiResponse.<String>builder().data(keywordRequestDto.getKeyword()).build();
    }


    // 키워드 최종선택
    @PostMapping("/submit/keyword")
    public ApiResponse<String> keywordSubmit(@RequestBody KeywordRequestDto keywordRequestDto){
        // 1. 레디스에 키워드 저장
        // 2. 단어 몇명 선택했는지 확인
        if(taleService.keywordSubmit(keywordRequestDto) >= 4){
            // 3. 모두 선택했으면 다음 단계로 넘어가기 -> websocket으로 알림 + 동화 생성
            // ai 쪽으로 동화 생성 요청
            GenerateTaleRequestDto generateTaleRequestDto = taleService.getGenerateTaleInfo(keywordRequestDto.getRoomId());
            aiServerRequestService.requestGenerateTale(keywordRequestDto.getRoomId(), generateTaleRequestDto);
        }
        // 4. 일단 응답은 ok
        return ApiResponse.<String>builder().data("OK").build();
    }
    @GetMapping("/test/aiPictrue/alive")
    public ApiResponse<Boolean> isAIPictureServerAlive(){
        return aiServerRequestService.isAIPictureServerAlive();
    }

    // 동화 손그림 제출
    @PostMapping("/submit/picture")
    public ApiResponse<String> submitHandPicture(@ModelAttribute SubmitFileRequestDto submitFileRequestDto){
        if(taleService.saveHandPicture(submitFileRequestDto) >= 4){
            long roomId = submitFileRequestDto.getRoomId();
            // 4명이 모두 그림을 제출했을 때,
            //  1. tale_member들을 mysql에 저장
            taleService.saveTaleFromRedis(roomId);

            //  2. 동화 완성을 websocket으로 알림
            webSocketNotiService.sendNotification("/topic/tale/" + roomId, "finish tale making");
            //  3. ai 쪽으로 그림 생성 요청

            if(aiServerRequestService.isAIPictureServerAlive().getData()){ // 그림생성 AI 서버가 켜져있을 경우
                aiServerRequestService.requestAIPicture(roomId); // ai 쪽으로 그림 생성 요청
            }else{// 그림생성 AI 서버가 꺼져있을 경우
                taleService.deleteTaleFromRedis(roomId); // redis에서 동화 정보 삭제
            }
        }
        
        return ApiResponse.<String>builder().build();
    }

    // 햇동화 요청
    // redis에서 동화 정보를 가져와서 반환
    @GetMapping("/temp/{roomId}/{page}")
    public ApiResponse<TalePageResponseDto> getTempTale(@PathVariable long roomId, @PathVariable int page){
        return ApiResponse.<TalePageResponseDto>builder().data(taleService.getTempTalePage(roomId, page)).build();
    }

    // 동화 요청
    // mySQL에서 동화 정보를 가져와서 반환
    @GetMapping("/{taleId}/{page}")
    public ApiResponse<TalePageResponseDto> getTale(@PathVariable long taleId, @PathVariable int page){
        return ApiResponse.<TalePageResponseDto>builder().data(taleService.getTalePage(taleId, page)).build();
    }

    // 햇동화 다읽음
    @GetMapping("/temp/end/{roomId}")
    public ApiResponse<Boolean> submitScriptVoice(@PathVariable long roomId){
        // AI 그림이 완성됐는지 확인하고 그 결과를 알려주기
        return ApiResponse.<Boolean>builder().data(taleService.getCompletedAIPictureCnt(roomId) >= 4).build();
    }

    // AI 그림 제출
    // AI 서버에서 그림이 완성됐을때 여기로 제출합니다.
    @PostMapping("/submit/ai-picture")
    public ApiResponse<String> submitAIPicture(@ModelAttribute SubmitFileRequestDto submitFileRequestDto){
        System.out.println("submitFileRequestDto = " + submitFileRequestDto);
        taleService.saveAIPicture(submitFileRequestDto);
        if(taleService.getCompletedAIPictureCnt(submitFileRequestDto.getRoomId()) >= 4){
            // 4명이 모두 그림을 제출했을 때,
            // 1. tale_member들을 mysql에 저장
            taleService.saveTaleFromRedis(submitFileRequestDto.getRoomId());

            // 2. redis에서 동화 정보 삭제
            taleService.deleteTaleFromRedis(submitFileRequestDto.getRoomId());
        }

        return ApiResponse.<String>builder().build();
    }

    // AI 서버에서 그림이 완성됐을때 여기로 제출합니다. (테스트용)
//    @PostMapping("/submitt/ai-picture")
//    public ApiResponse<String> submitAIPictures(@ModelAttribute SubmitFileRequestDto submitFileRequestDto){
//        System.out.println("submitFileRequestDto = " + submitFileRequestDto);
//        System.out.println(
//                "submitaipicture 도착햇다아아아아랑ㄴㅁ;러ㅏㅇ니라ㅓ마;ㅣㄹㅇ"
//        );
//        //aiServerRequestService.requestTestAIPicture(submitFileRequestDto);
//        //taleService.saveAIPicture(submitFileRequestDto);
//        return ApiResponse.<String>builder().build();
//    }
}
