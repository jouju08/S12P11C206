package com.ssafy.backend.common.exception;

/**
 *  author : park byeongju
 *  date : 2025.02.10
 *  description : 없는 페이지에 대한 요청일 시 에러
 *  update
 *      1.
 * */

public class NotFoundPageException extends RuntimeException {
    public NotFoundPageException(String message) {
        super(message);
    }
}
