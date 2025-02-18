package com.ssafy.backend.tale.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

/**
 * author : park byeongju
 * date : 2025.01.31
 * description : 동화 상세 정보를 제공하기 위한 응답 DTO
 */

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TaleDetailResponseDto {
    long taleId;
    long baseTaleId;
    String title;
    String coverImg;
    List<String> participants; // 참여자 닉네임
    String createdAt;
}
