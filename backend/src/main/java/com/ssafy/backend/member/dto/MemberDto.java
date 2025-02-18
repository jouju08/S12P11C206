package com.ssafy.backend.member.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MemberDto {
    private Long memberId;
    private String loginId;
    private String nickname;
    private String profilePic;
    private boolean connecting;
}
