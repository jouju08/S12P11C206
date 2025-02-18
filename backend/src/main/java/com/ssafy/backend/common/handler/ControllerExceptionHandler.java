package com.ssafy.backend.common.handler;

import com.ssafy.backend.common.dto.ApiResponse;
import com.ssafy.backend.common.ResponseCode;
import com.ssafy.backend.common.ResponseMessage;
import com.ssafy.backend.common.exception.BadRequestException;
import com.ssafy.backend.common.exception.NotFoundPage;
import com.ssafy.backend.common.exception.NotFoundUserException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 *  author : park byeongju
 *  date : 2025.01.19
 *  description : 예외 처리 컨틀로러
 *                정의 되어있지 않은 에러는 SERVER_ERROR로 마지막에 한번에 처리
 *  update
 *      1.
 * */
@RestControllerAdvice
public class ControllerExceptionHandler {

    @ExceptionHandler(BadRequestException.class)
    public ApiResponse<?> badRequestHandler(BadRequestException e) {
        return ApiResponse.builder()
                .data(e.getMessage())
                .status(ResponseCode.BAD_REQUEST)
                .message(ResponseMessage.BAD_REQUEST)
                .build();
    }

    @ExceptionHandler(NotFoundUserException.class)
    public ApiResponse<?> badRequestHandler(NotFoundUserException e) {
        return ApiResponse.builder()
                .data(e.getMessage())
                .status(ResponseCode.NOT_FOUND)
                .message(ResponseMessage.NOT_FOUND)
                .build();
    }
    @ExceptionHandler(NotFoundPage.class)
    public ApiResponse<?> notFoundPageHandler(NotFoundPage e) {
        return ApiResponse.builder()
                .data(e.getMessage())
                .status(ResponseCode.NOT_FOUND_PAGE)
                .message(ResponseMessage.NOT_FOUND_PAGE)
                .build();
    }

    public ApiResponse<?> unAuthorizedHandler(Exception e) {
        return ApiResponse.builder()
                .data(e.getMessage())
                .status(ResponseCode.AUTHROIZATION_FAILED)
                .message(ResponseMessage.AUTHROIZATION_FAILED)
                .build();
    }

    
    // 이외의 정의되지 않은 서버 에러처리
    @ExceptionHandler(Exception.class)
    public ApiResponse<?> serverErrorHandler(Exception e) {
        e.printStackTrace();
        return ApiResponse.builder()
                .data(e.getMessage())
                .status(ResponseCode.SERVER_ERROR)
                .message(ResponseMessage.SERVER_ERROR)
                .build();
    }

}
