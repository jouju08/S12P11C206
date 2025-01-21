package com.ssafy.backend.guide.model;

import lombok.*;

/*
 *  author : park byeongju
 *  date : 2025.01.19
 *  description : 프로젝트 표준 API 예제를 위한 객체(DTO)
 *  update
 *      1. redis 가이드 코드를 위한 컬럼 추가
 * */

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Guide {
    private Long id;
    private String example;
    private int number;
}
