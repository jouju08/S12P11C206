package com.ssafy.backend.tale.dto.response;

import lombok.*;

import java.util.List;

/**
 * author : HEO-hyunjun
 * date : 2025.01.31
 * description : 동화 제작 시작 응답 DTO
 */

@Data
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class StartTaleMakingResponseDto {
    private String taleTitle;
    private String taleStartScript;
    private String taleStartScriptVoice;
    private List<SentenceOwnerPair> sentenceOwnerPairs;
    private String taleStartImage;
}
