package com.ssafy.backend.tale.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class PageInfo {
    private String extractedSentence;
    private String fullText;
}
