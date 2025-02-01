package com.ssafy.backend.tale.dto.request;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class SubmitFileRequestDto {
    private long roomId;
    private long memberId;
    private MultipartFile file;
}
