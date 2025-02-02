package com.ssafy.backend.tale.dto.response;

import lombok.*;

/**
 * author : HEO-hyunjun
 * date : 2025.01.31
 * description : 동화 내용을 담는 객체
 */

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class PageInfo {
    private String extractedSentence;
    private String fullText;
}
