package com.ssafy.backend.tale.dto.response;

import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ImageUrlListResponseDto {
    private List<String> images;
}
