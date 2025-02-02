package com.ssafy.backend.tale.dto.request;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

/**
 * author : 허현준
 * date : 2025.02.01
 * description : 파일 제출 요청 DTO
 * update:
 *  1. order 추가 (2025.02.02)
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class SubmitFileRequestDto {
    private int order;
    private long roomId;
    private long memberId;
    private MultipartFile file;
}
