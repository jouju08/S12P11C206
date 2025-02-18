package com.ssafy.backend.tale.dto.response;

import com.ssafy.backend.tale.dto.common.PromptSet;
import lombok.*;

import java.util.List;

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
public class DiffusionPromptResponseDto {
    private List<PromptSet> prompts;
}
