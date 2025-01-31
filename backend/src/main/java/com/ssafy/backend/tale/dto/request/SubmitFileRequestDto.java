package com.ssafy.backend.tale.dto.request;

import org.springframework.web.multipart.MultipartFile;

public class SubmitFileRequestDto {
    private long roomId;
    private long memberId;
    private MultipartFile file;
}
