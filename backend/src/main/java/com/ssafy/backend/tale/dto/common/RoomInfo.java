package com.ssafy.backend.tale.dto.common;

import lombok.*;

/*
 *  author : park byeongju
 *  date : 2025.01.23
 *  description : Room list를 위해 경량화 된 Room 정보 객체,
 *                해당 객체 타입으로 Redis에서 방 상태를 유지 함.
 *  update
 *      1.
 * */

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class RoomInfo {
    private Long roomId;
    private Long hostMemberId;
    private String hostNickname;
    private String hostProfileImg;
    private String taleTitle;
    private String taleTitleImg;
    private Long baseTaleId;
    private int participantsCnt;
    private int maxParticipantsCnt;

}
