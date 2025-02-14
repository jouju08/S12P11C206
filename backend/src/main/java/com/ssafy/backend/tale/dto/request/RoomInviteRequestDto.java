package com.ssafy.backend.tale.dto.request;

import lombok.*;

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
