package com.ssafy.backend.tale.dto.response;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * author : HEO-hyunjun
 * date : 2025.02.04
 * description : 동화 페이지 정보를 반환하기 위한 DTO
 */

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TalePageResponseDto {
    private int orderNum;
    private long memberId;
    private long taleId;

    private String originImg;
    private String img;
    private String voice;
    private String script;
}
