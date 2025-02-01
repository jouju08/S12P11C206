package com.ssafy.backend.tale.dto.request;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class KeywordFileRequestDto {
    private Long memberId;
    private Long roomId;
    private MultipartFile keyword;
}
