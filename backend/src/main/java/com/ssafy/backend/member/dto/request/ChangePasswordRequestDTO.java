package com.ssafy.backend.member.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ChangePasswordRequestDTO {
    @NotBlank
    private String oldPassword;

    @NotBlank
    private String newPassword;
}
