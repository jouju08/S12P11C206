package com.ssafy.backend.member.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class GetMemberResponseDTO {

    private Long id;
    private String loginId;
    private String email;
    private String nickname;
    private Character loginType;
    private String birth;
    private String profileImg;

}
