package com.ssafy.backend.guide.controller;

import com.ssafy.backend.common.ApiResponse;
import com.ssafy.backend.common.ResponseCode;
import com.ssafy.backend.common.ResponseMessage;
import com.ssafy.backend.guide.model.Guide;
import com.ssafy.backend.guide.service.GuideService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/*
 *  author : park byeongju
 *  date : 2025.01.20
 *  description : 프로젝트 표준 API 예제
 *  update
 *      1.
 * */

@RestController
@RequiredArgsConstructor
public class GuideController {

    private final GuideService guideService;

    @GetMapping("/guide")
    public ApiResponse<Guide> getGuide() {
        Guide response = new Guide(1L, "API Guide", 1);

        return ApiResponse.<Guide>builder()
                .data(response)
                .build();
    }

    @GetMapping("/guide/redis")
    public ApiResponse<Guide> getGuideRedis() {
        guideService.redisInOutGuide();
        return null;
    }
}
