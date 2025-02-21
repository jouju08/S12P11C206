package com.ssafy.backend.member.dto.request;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 *  author : park byeongju
 *  date : 2025.01.25
 *  description : 회원가입에 필요한 요청 DTO
 *  update
 *      1.
 * */

@Getter
@Setter
@ToString
public class RegisterRequest {
    private String loginId;
    private String password;
    private String email;
    private String nickname;
    private String birth;
    private String loginType;
    private boolean isDeleted;
}
