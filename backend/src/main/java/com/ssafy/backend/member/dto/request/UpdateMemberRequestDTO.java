package com.ssafy.backend.member.dto.request;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@Builder
public class UpdateMemberRequestDTO {
    private String nickname;
    private String email;
    private String birth;
}
