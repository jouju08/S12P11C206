package com.ssafy.backend.tale.dto.request;

import lombok.*;

/**
 *  author : park byeongju
 *  date : 2025.01.23
 *  description : 방 생성을 위한 요청 DTO,
 *  update
 *      1.
 * */

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class MakeRoomRequestDto {
    private Long memberId;
    private int partiCnt;
    private Long baseTaleId;
}
