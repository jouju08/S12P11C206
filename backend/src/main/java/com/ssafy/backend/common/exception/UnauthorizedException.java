package com.ssafy.backend.common.exception;

/*
 *  author : park byeongju
 *  date : 2025.01.19
 *  description : 권한 부족 예외처리 객체
 *  update
 *      1.
 * */
public class UnauthorizedException extends RuntimeException {
    public UnauthorizedException(String message) {
        super(message);
    }
}