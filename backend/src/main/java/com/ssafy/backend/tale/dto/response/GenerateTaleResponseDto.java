package com.ssafy.backend.tale.dto.response;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class GenerateTaleResponseDto {
    private List<PageInfo> pages;
}
