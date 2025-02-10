package com.ssafy.backend.tale.controller;

import com.ssafy.backend.common.S3Service;
import com.ssafy.backend.tale.dto.request.TextRequestDto;
import com.ssafy.backend.tale.service.AIServerRequestService;
import com.ssafy.backend.tale.service.BaseTaleService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/admin/tale")
public class AdminTaleController {
    private final BaseTaleService baseTaleService;
    private final S3Service s3Service;
    private final AIServerRequestService aiServerRequestService;

    //todo
    // 1. 동화 제목으로 동화 keyword sentence, 도입부 생성 API
    // 2. 동화 도입부 스크립트 읽기 API
    // 3. 동화 타이틀이미지 생성 API
    // 4. 동화 도입부이미지 생성 API
    // 5. BaseTale 저장 API
    // 6. BaseTale 수정 API

//    @PostMapping("/test")
//    public void test(@RequestBody TextRequestDto textRequestDto) {
//        System.out.println(textRequestDto.getText());
//        String myText = s3Service.uploadFileFromExternalLink(textRequestDto.getText());
//        System.out.println("myText = " + myText);
//    }
    @GetMapping("/tale-sentences/{title}")
    public void generateTaleSentences(@PathVariable String title) {

    }

    @PostMapping("/tale-script-read")
    public void readTaleScript(@RequestBody TextRequestDto textRequestDto) {
        
    }

    @PostMapping("/gen-title-image")
    public void generateTitleImage() {

    }

    @PostMapping("/set-title-image")
    public void setTitleImage(@RequestBody TextRequestDto textRequestDto) {

    }

    @PostMapping("/gen-intro-image")
    public void generateIntroImage() { // requestBody title, intro

    }

    @PostMapping("/set-intro-image")
    public void setIntroImage(@RequestBody TextRequestDto textRequestDto) {

    }

    @PostMapping("/base-tale")
    public void saveBaseTale() { // requestBody title, intro, titleImage, introImage

    }

    @PutMapping("/base-tale")
    public void updateBaseTale() { // requestBody title, intro, titleImage, introImage

    }
}
