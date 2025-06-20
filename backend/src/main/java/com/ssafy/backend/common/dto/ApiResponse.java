package com.ssafy.backend.common.dto;

import com.ssafy.backend.common.ResponseCode;
import com.ssafy.backend.common.ResponseMessage;
import lombok.Builder;
import lombok.Data;

/**
 *  author : park byeongju
 *  date : 2025.01.19
 *  description : 프로젝트 표준 API 리턴 객체, status와 message 기입 안하면 Success 제공
 *  update
 *      1.
 * */
@Builder
@Data
public class ApiResponse<T> {
    @Builder.Default
    private String status = ResponseCode.SUCCESS;
    @Builder.Default// "SU" 또는 "VF" 등...
    private String message = ResponseMessage.SUCCESS;       // 응답에 대한 설명
    private T data;                                         // 실제 반환 데이터
}
