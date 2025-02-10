package com.ssafy.backend.tale.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TaleSentencesResponseDto {
    private String introduction;
    private List<String> sentences;
}
