package com.ssafy.backend.tale.dto.common;

import com.ssafy.backend.db.entity.Member;
import lombok.*;

import java.util.HashMap;
import java.util.Map;

/**
 *  author : park byeongju
 *  date : 2025.01.23
 *  description : 방 상태 관리를 Room 객체 클래스,
 *                해당 객체 타입으로 Redis에서 방 상태를 유지 함.
 *  update
 *      1.
 * */

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class Room {
    private Long roomId;
    private Long baseTaleId;
    private Long memberId;
    private int maxParticipantsCnt;
    private boolean isFull = false;
    private Map<Long, Member> participants = new HashMap<>();
}
