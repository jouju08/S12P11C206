package com.ssafy.backend.tale.dto.common;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
/**
 * author : HEO-hyunjun
 * date : 2025.01.31
 * description : 기본 동화 내용을 담는 객체
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BaseTaleDto {
    private Long id;
    private String title;
    private String titleImg;
    private String startVoice;
    private String startImg;
    private String startScript;
    private String keyword1;
    private String keyword2;
    private String keyword3;
    private String keyword4;
    private String keywordSentence1;
    private String keywordSentence2;
    private String keywordSentence3;
    private String keywordSentence4;

}
