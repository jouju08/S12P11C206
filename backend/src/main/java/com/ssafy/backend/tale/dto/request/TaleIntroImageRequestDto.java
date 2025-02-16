package com.ssafy.backend.tale.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TaleIntroImageRequestDto {
    private Long memberId;
    private String title;
    private String intro;
}
