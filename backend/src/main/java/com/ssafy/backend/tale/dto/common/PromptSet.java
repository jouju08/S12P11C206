package com.ssafy.backend.tale.dto.common;

import lombok.*;

/**
 *  author : HEO-hyunjun
 *  date : 2025.01.31
 *  description : 디퓨전 프롬프트에 들어갈 자료형입니다.
 *  update
 * */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class PromptSet {
    private String prompt;
    private String negativePrompt;
}
