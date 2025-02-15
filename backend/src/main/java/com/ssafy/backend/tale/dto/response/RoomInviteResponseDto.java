package com.ssafy.backend.tale.dto.response;

import com.ssafy.backend.tale.dto.common.RoomInfo;
import lombok.*;

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
