package com.ssafy.backend.tale.dto.request;

import lombok.*;

/**
 *  author : park byeongju
 *  date : 2025.01.23
 *  description : 방 나가기를 위한 요청 DTO,
 *  update
 *      1.
 * */

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class LeaveRoomRequestDto {
    private Long roomId;
    private Long leaveMemberId;
}
