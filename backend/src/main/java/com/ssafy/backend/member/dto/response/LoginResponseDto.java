package com.ssafy.backend.member.dto.response;

import com.ssafy.backend.db.entity.Member;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Map;

/**
 *  author : park byeongju
 *  date : 2025.01.25
 *  description : 로그인 정보 제공 위한 응답 DTO
 *  update
 *      1.
 * */

@Setter
@Getter
@ToString
public class LoginResponseDto {
    private Map<String, String> tokens;
    private Member member;
}
