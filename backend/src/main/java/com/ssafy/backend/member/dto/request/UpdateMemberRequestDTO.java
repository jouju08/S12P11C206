package com.ssafy.backend.member.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateMemberRequestDTO {
    @NotBlank
    @Size(min = 2, max = 20)
    private String nickname;

    @Email
    private String email;

    private String birth;
}
