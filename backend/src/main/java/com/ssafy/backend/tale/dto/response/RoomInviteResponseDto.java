package com.ssafy.backend.tale.dto.response;

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
}
