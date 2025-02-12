package com.ssafy.backend.member.controller;

import com.ssafy.backend.common.ApiResponse;
import com.ssafy.backend.common.ResponseCode;
import com.ssafy.backend.dto.EmailCheckDto;
import com.ssafy.backend.dto.EmailRequestDto;
import com.ssafy.backend.member.service.EmailSendService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
@RequestMapping("/api/auth/email")
@RestController
@RequiredArgsConstructor
public class EmailController {
    private final EmailSendService emailSendService;

    /* Send Email: 인증번호 전송 버튼 click */
    @PostMapping("/send")
    public Map<String, String> mailSend(@RequestBody @Valid EmailRequestDto emailRequestDto) {
        String code = emailSendService.joinEmail(emailRequestDto.getEmail());
        // response를 JSON 문자열으로 반환
        Map<String, String> response = new HashMap<>();
        response.put("code", code);

        return response;
    }

    /* Email Auth: 인증번호 입력 후 인증 버튼 click */
    @PostMapping("/verify")
    public ApiResponse authCheck(@RequestBody @Valid EmailCheckDto emailCheckDto) {
        Boolean checked = emailSendService.checkAuthNum(emailCheckDto.getEmail(), emailCheckDto.getAuthNum());
        if (checked) {
            return ApiResponse.builder().status(ResponseCode.SUCCESS).data(emailCheckDto).build();
        }
        else {
            return ApiResponse.builder().status(ResponseCode.BAD_REQUEST).data(emailCheckDto).build();
        }
    }



}
