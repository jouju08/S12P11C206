package com.ssafy.backend.member.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

/**
 *  author : lee youngjae
 *  date : 2025.01.25
 *  description : 회원 정보 수정을 위한 요청 DTO
 *  update
 *      1.
 * */

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateMemberRequestDTO {
    @NotBlank
    @Size(min = 2, max = 20)
    private String nickname;

    private String birth;
}
