package com.ssafy.backend.tale.dto.response;

import com.ssafy.backend.tale.dto.common.RoomInfo;
import lombok.*;

/**
 * author : park byeongju
 * date : 2025.01.31
 * description : 방 초대 정보를 담기 위한 응답 DTO
 */

@Getter
@Setter
@ToString
@AllArgsConstructor
@RequiredArgsConstructor
public class RoomInviteResponseDto {
    String roomId;
    String from;
    String to;
    String nickname;
    RoomInfo roomInfo;
}
