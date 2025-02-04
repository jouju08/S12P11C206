package com.ssafy.backend.tale.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * author : HEO-hyunjun
 * date : 2025.02.02
 * description : 음성 스크립트를 AI 서버에 요청하기 위한 DTO
 */

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class VoiceScriptRequestDto {
    private String script;
}
