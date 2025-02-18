package com.ssafy.backend.common.exception;

/**
 *  author : park byeongju
 *  date : 2025.01.19
 *  description : 없는 자원에 대한 접근 시 발생 에러
 *  update
 *      1.
 * */

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
