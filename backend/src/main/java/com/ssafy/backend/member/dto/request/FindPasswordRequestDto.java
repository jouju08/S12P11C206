package com.ssafy.backend.member.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

/**
 * author : lee youngjae
 * date : 2025.02.18
 * description : 비밀변호 변경을 위한 요청 DTO
 * update
 * 1.
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FindPasswordRequestDto {
    String LoginId;
    String email;
}
