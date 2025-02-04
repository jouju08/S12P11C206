package com.ssafy.backend.tale.dto.request;

import com.ssafy.backend.tale.dto.common.PromptSet;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;


// AI 서버에 이미지를 보내기 위한 DTO

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AIPictureRequestDto {
    private long roomId;
    private int order;
    private MultipartFile image;
    private PromptSet promptSet;
}
