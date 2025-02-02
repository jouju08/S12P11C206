package com.ssafy.backend.tale.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class PromptSet {
    private String prompt;
    private String negativePrompt;
}
