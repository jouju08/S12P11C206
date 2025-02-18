package com.ssafy.backend.member.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

/**
 *  author : lee youngjae
 *  date : 2025.01.25
 *  description : 회원 정보 제공 위한 응답 DTO
 *  update
 *      1.
 * */

@Getter
@Setter
@Builder
public class MemberResponseDTO {

    private Long id;
    private String loginId;
    private String email;
    private String nickname;
    private Character loginType;
    private String birth;
    private String profileImg;

}
