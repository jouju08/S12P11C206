package com.ssafy.backend.tale.dto.request;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class KeywordFileRequestDto {
    private MultipartFile keyword;
}
