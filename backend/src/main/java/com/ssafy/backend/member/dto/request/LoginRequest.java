package com.ssafy.backend.member.dto.request;

import lombok.Getter;
import lombok.Setter;
/**
 *  author : park byeongju
 *  date : 2025.01.25
 *  description : 로그인에 필요한 요청 DTO
 *  update
 *      1.
 * */

@Getter
@Setter
public class LoginRequest {
    private String loginId;
    private String password;
}
