package com.ssafy.backend.tale.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SentenceOwnerPair {
    private int order;
    private long owner;
    private String sentence;
}
