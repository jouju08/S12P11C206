package com.ssafy.backend.member.dto.request;

import lombok.Getter;

/**
 *  author : park byeongju
 *  date : 2025.01.25
 *  description : 리프레쉬 토큰을 받는 DTO
 *  update
 *      1.
 * */

@Getter
public class RefreshTokenRequestDto {
    private String refreshToken;
}
