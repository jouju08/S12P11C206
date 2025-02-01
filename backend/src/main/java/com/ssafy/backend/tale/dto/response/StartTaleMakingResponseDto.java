package com.ssafy.backend.tale.dto.response;

import lombok.*;

import java.util.List;

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
