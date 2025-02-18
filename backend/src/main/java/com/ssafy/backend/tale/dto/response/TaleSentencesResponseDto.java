package com.ssafy.backend.tale.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

/**
 * author : heo hyunjun
 * date : 2025.01.31
 * description : 동화 문장을 전송하기 위한 DTO
 */

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TaleSentencesResponseDto {
    private String introduction;
    private List<String> sentences;
}
