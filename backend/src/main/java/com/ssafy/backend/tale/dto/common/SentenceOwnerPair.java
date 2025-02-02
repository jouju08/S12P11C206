package com.ssafy.backend.tale.dto.common;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * author : 허현준
 * date: 2025.02.02
 * description: 프론트에 넘겨줄 문장과 문장의 주인을 담는 객체
 * update:
 * 1. order 추가
 * 2. 이름 변경
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SentenceOwnerPair {
    private int order;
    private long owner;
    private String sentence;
}
