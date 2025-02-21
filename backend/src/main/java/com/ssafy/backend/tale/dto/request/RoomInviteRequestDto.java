package com.ssafy.backend.tale.dto.request;

import lombok.*;

/**
 * author : park byeongju
 * date : 2025.01.31
 * description : 방 초대 정보 DTO
 */

@Getter
@Setter
@ToString
@AllArgsConstructor
@RequiredArgsConstructor
public class RoomInviteRequestDto {
    String roomId;
    String from;
    String to;
}
