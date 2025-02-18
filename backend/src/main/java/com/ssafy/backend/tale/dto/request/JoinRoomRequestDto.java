package com.ssafy.backend.tale.dto.request;

import lombok.*;

/**
 *  author : park byeongju
 *  date : 2025.01.23
 *  description : 방 참여를 위한 요청 DTO,
 *  update
 *      1.
 * */

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class JoinRoomRequestDto {
    private Long roomId;
    private Long memberId;
}
