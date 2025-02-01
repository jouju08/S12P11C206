package com.ssafy.backend.tale.dto.request;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class GenerateTaleRequestDto {
    private String title;
    private String introduction;
    private List<String> sentences;
}
