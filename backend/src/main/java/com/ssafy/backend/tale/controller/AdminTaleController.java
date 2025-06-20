package com.ssafy.backend.tale.controller;

import com.ssafy.backend.common.dto.ApiResponse;
import com.ssafy.backend.common.service.S3Service;
import com.ssafy.backend.common.service.WebSocketNotiService;
import com.ssafy.backend.common.exception.BadRequestException;
import com.ssafy.backend.db.entity.BaseTale;
import com.ssafy.backend.tale.dto.common.BaseTaleDto;
import com.ssafy.backend.tale.dto.common.ParentBaseTaleDto;
import com.ssafy.backend.tale.dto.request.TaleIntroImageRequestDto;
import com.ssafy.backend.tale.dto.request.TaleTitleImageRequestDto;
import com.ssafy.backend.tale.dto.request.TextRequestDto;
import com.ssafy.backend.tale.dto.response.*;
import com.ssafy.backend.tale.service.AIServerRequestService;
import com.ssafy.backend.tale.service.BaseTaleService;
import com.ssafy.backend.tale.service.ParentBaseTaleService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 *  author : heo hyunjun
 *  date : 2025.02.16
 *  description : 동화 생성 관련 어드민 컨틀롤러
 *  update
 *      1.
 * */

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/admin/tale")
public class AdminTaleController {
    private final BaseTaleService baseTaleService;
    private final ParentBaseTaleService parentBaseTaleService;
    private final S3Service s3Service;
    private final AIServerRequestService aiServerRequestService;
    private final WebSocketNotiService webSocketNotiService;
    private final String AUTHKEY = "ssafyssafy";
    //todo
    // 1. 동화 제목으로 동화 keyword sentence, 도입부 생성 API
    // 2. 동화 도입부 스크립트 읽기 API
    // 3. 동화 타이틀이미지 생성 API
    // 4. 동화 도입부이미지 생성 API
    // 5. BaseTale 저장 API
    // 6. BaseTale 수정 API

//    @PostMapping("/test")
//    public void test(@RequestBody TextRequestDto textRequestDto) {
//        String myText = s3Service.uploadFileFromExternalLink(textRequestDto.getText());
//    }
    @GetMapping("/tale-sentences/{title}")
    public ApiResponse<TaleSentencesResponseDto> generateTaleSentences(@PathVariable String title) {
        return aiServerRequestService.requestTaleSentences(title);
    }

    @PostMapping("/tale-script-read")
    public ApiResponse<String> readTaleScript(@RequestBody TextRequestDto textRequestDto) {
        String file = aiServerRequestService.requestVoiceScript(textRequestDto.getText());
        return ApiResponse.<String>builder().data(file).build();
    }

    // 타이틀 이미지 생성 요청
    @PostMapping("/gen-title-image")
    public ApiResponse<Void> generateTitleImage(@RequestBody TaleTitleImageRequestDto taleTitleImageRequestDto) {
        aiServerRequestService.requestTaleImage(taleTitleImageRequestDto);
        return ApiResponse.<Void>builder().build();
    }

    // 타이틀 이미지 생성 완료 후 AI 이미지 webhook 요청
    @PostMapping("/submit/ai-picture/{memberId}")
    public void submitAiPicture(@RequestBody ImageUrlListResponseDto imageUrlListResponseDto, @PathVariable Long memberId) {
        //websocket으로 알림
        webSocketNotiService.sendNotification("/topic/gen/title-image/"+memberId.toString(), imageUrlListResponseDto);
    }

    // 선택한 이미지 저장
    @PostMapping("/set-image")
    public ApiResponse<TextResponseDto> setImage(@RequestBody TextRequestDto textRequestDto) {
        TextResponseDto textResponseDto = new TextResponseDto();
        textResponseDto.setText(s3Service.uploadFileFromExternalLink(textRequestDto.getText()));
        return ApiResponse.<TextResponseDto>builder().data(textResponseDto).build();
    }

    // 도입부 이미지 생성 요청
    @PostMapping("/gen-intro-image")
    public ApiResponse<Void> generateIntroImage(@RequestBody TaleIntroImageRequestDto taleIntroImageRequestDto) { // requestBody title, intro
        aiServerRequestService.requestTaleIntroImage(taleIntroImageRequestDto);
        return ApiResponse.<Void>builder().build();
    }

    // 도입부 이미지 생성 완료 후 AI 이미지 webhook 요청
    @PostMapping("/submit/ai-intro-picture/{memberId}")
    public void submitAiIntroPicture(@RequestBody ImageUrlListResponseDto imageUrlListResponseDto, @PathVariable Long memberId) {
        //websocket으로 알림
        webSocketNotiService.sendNotification("/topic/gen/intro-image/"+memberId.toString(), imageUrlListResponseDto);
    }

    // 생성된 BaseTale 정보 저장
    @PostMapping("/base-tale")
    public  ApiResponse<Long> saveBaseTale(@RequestBody BaseTaleDto baseTaleDto, @RequestHeader("authKey") String authKey) {
        if(!authKey.equals(AUTHKEY)) {
            throw new BadRequestException("인증키가 일치하지 않습니다.");
        }
        BaseTale baseTale = baseTaleService.parse(baseTaleDto);
        baseTale = baseTaleService.save(baseTale);
        return ApiResponse.<Long>builder().data(baseTale.getId()).build();
    }

    // BaseTale 정보 수정
    @GetMapping("/base-tale/{id}")
    public ApiResponse<BaseTaleDto> getBaseTale(@PathVariable Long id, @RequestHeader("authKey") String authKey) { // requestBody title, intro, titleImage, introImage
        if(!authKey.equals(AUTHKEY)) {
            throw new BadRequestException("인증키가 일치하지 않습니다.");
        }
        BaseTale baseTale = baseTaleService.getById(id);
        BaseTaleDto baseTaleDto = baseTaleService.parse(baseTale);
        return ApiResponse.<BaseTaleDto>builder().data(baseTaleDto).build();
    }

    @GetMapping("/base-tale")
    public ApiResponse<List<BaseTaleResponseDto>> getBaseTale(@RequestHeader("authKey") String authKey) {
        if(!authKey.equals(AUTHKEY)) {
            throw new BadRequestException("인증키가 일치하지 않습니다.");
        }
        return ApiResponse.<List<BaseTaleResponseDto>>builder().data(baseTaleService.getBaseTaleList()).build();
    }

    @PostMapping("/auth")
    public ApiResponse<Boolean> checkAuthKey(@RequestBody TextRequestDto textRequestDto) {
        return ApiResponse.<Boolean>builder().data(textRequestDto.getText().equals(AUTHKEY)).build();
    }

    @GetMapping("/parent")
    public ApiResponse<List<ParentBaseTaleResponseDto>> getParentBaseTale(@RequestHeader("authKey") String authKey) {
        if(!authKey.equals(AUTHKEY)) {
            throw new BadRequestException("인증키가 일치하지 않습니다.");
        }
        return ApiResponse.<List<ParentBaseTaleResponseDto>>builder().data(parentBaseTaleService.getList(false)).build();
    }

    @GetMapping("/parent/{id}")
    public ApiResponse<ParentBaseTaleDto> getParentBaseTale(@PathVariable Long id, @RequestHeader("authKey") String authKey) {
        if(!authKey.equals(AUTHKEY)) {
            throw new BadRequestException("인증키가 일치하지 않습니다.");
        }
        ParentBaseTaleDto parentBaseTale = parentBaseTaleService.getById(id);
        return ApiResponse.<ParentBaseTaleDto>builder().data(parentBaseTale).build();
    }

    @PostMapping("/parent")
    public ApiResponse<Void> saveParentBaseTale(@RequestBody ParentBaseTaleDto parentBaseTaleDto, @RequestHeader("authKey") String authKey) {
        if(!authKey.equals(AUTHKEY)) {
            throw new BadRequestException("인증키가 일치하지 않습니다.");
        }
        if(parentBaseTaleDto.getHasApproved()){
            BaseTale baseTale = baseTaleService.parse(parentBaseTaleDto);
            baseTaleService.save(baseTale);
        }
        parentBaseTaleDto.setHasApproved(true);
        parentBaseTaleService.save(parentBaseTaleDto);

        return ApiResponse.<Void>builder().build();
    }
}
