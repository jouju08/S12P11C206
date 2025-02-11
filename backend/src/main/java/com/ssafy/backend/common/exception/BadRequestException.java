package com.ssafy.backend.common.exception;

/**
 *  author : park byeongju
 *  date : 2025.01.19
 *  description : 잘못된 요청 예외처리 객체
 *  update
 *      1.
 * */
public class BadRequestException extends RuntimeException {
    public BadRequestException(String message) {
        super(message);
    }
}
