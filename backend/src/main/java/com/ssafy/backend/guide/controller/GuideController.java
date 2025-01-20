package com.ssafy.backend.guide.controller;

import com.ssafy.backend.common.ApiResponse;
import com.ssafy.backend.common.ResponseCode;
import com.ssafy.backend.common.ResponseMessage;
import com.ssafy.backend.guide.model.Guide;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/*
 *  author : park byeongju
 *  date : 2025.01.19
 *  description : 프로젝트 표준 API 예제
 *  update
 *      1.
 * */

@RestController
public class GuideController {

    @GetMapping("/guide")
    public ApiResponse<Guide> getGuide() {
        Guide response = new Guide("API Guide");

        return ApiResponse.<Guide>builder()
                .data(response)
                .build();
    }
}
