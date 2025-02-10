package com.ssafy.backend.tale.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TaleDetailResponseDto {
    long taleId;
    long baseTaleId;
    List<String> participants; // 참여자 닉네임
    String createdAt;
}
