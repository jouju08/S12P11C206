package com.ssafy.backend.tale.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class KeywordSentence {
    private long owner;
    private String sentence;
}
