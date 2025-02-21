package com.ssafy.backend.member.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

/**
 * author : lee youngjae
 * date : 2025.02.18
 * description : 비밀변호 변경을 위한 DTO
 * update
 * 1.
 */

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChangePasswordRequestDTO {
    @NotBlank(message = "현재 비밀번호를 입력해 주세요.")
    private String oldPassword;

    @NotBlank(message = "새 비밀번호를 입력해 주세요.")
    @Size(min = 8, max = 12, message = "비밀번호는 8~12자여야 합니다.")
    @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[!@#$%^&*])[A-Za-z\\d!@#$%^&*]+$",
            message = "비밀번호는 영문, 숫자, 특수기호(!@#$%^&*)를 포함해야 합니다.")
    private String newPassword;
}
