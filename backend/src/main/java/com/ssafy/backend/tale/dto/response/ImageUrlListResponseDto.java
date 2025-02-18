package com.ssafy.backend.tale.dto.response;

import lombok.*;

import java.util.List;

/**
 * author : heo hyunjun
 * date : 2025.01.31
 * description : 이미지 LIST를 제공하기 위한 응답 DTO
 */

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ImageUrlListResponseDto {
    private List<String> images;
}
