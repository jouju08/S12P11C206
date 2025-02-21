package com.ssafy.backend.tale.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * author : heo hyunjun
 * date : 2025.01.31
 * description : Text 전송을 위한 응답 DTO
 */

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TextResponseDto {
    private String text;
}
