package com.ssafy.backend.member.dto.response;

import com.ssafy.backend.db.entity.Member;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Map;

@Setter
@Getter
@ToString
public class LoginResponseDto {
    private Map<String, String> tokens;
    private Member member;
}
