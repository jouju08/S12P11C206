package com.ssafy.backend.tale.controller;

import com.ssafy.backend.tale.dto.common.Room;
import com.ssafy.backend.tale.dto.request.JoinRoomRequestDto;
import com.ssafy.backend.tale.dto.request.LeaveRoomRequestDto;
import com.ssafy.backend.tale.dto.request.MakeRoomRequestDto;
import com.ssafy.backend.tale.dto.common.RoomInfo;
import com.ssafy.backend.tale.dto.request.RoomInviteRequestDto;
import com.ssafy.backend.tale.dto.response.RoomInviteResponseDto;
import com.ssafy.backend.tale.dto.response.StartTaleMakingResponseDto;
import com.ssafy.backend.tale.service.RoomService;
import com.ssafy.backend.tale.service.TaleService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.util.List;

/**
 *  author : park byeongju
 *  date : 2025.01.23
 *  description : 동화 만들기 Room 소켓 컨트롤러,
 *                방 만들기, 참여하기, 나가기, 방 조회, 방리스트
 *  update
 *      1.
 * */
@Controller
@RequiredArgsConstructor
public class RoomController {
    private final RoomService roomService;
    private final TaleService taleService;


    @MessageMapping("/room/create")
    @SendTo("/topic/rooms")
    public Room createRoom(MakeRoomRequestDto makeRoomDto) {
        return roomService.makeRoom(makeRoomDto);
    }

    @MessageMapping("/room/join/{roomId}")
    @SendTo("/topic/room/{roomId}")
    public Room joinRoom(JoinRoomRequestDto joinRoomRequestDto) {
        return roomService.joinRoom(joinRoomRequestDto);
    }

    @MessageMapping("/room/leave/{roomId}")
    @SendTo("/topic/room/leave/{roomId}")
    public Room leaveRoom(LeaveRoomRequestDto leaveRoomRequestDto) {
        return roomService.leaveRoom(leaveRoomRequestDto);
    }

    @MessageMapping("/room/info/{roomId}")
    @SendTo("/topic/room/info/{roomId}")
    public Room getRoom(Room room) {
        return roomService.getRoom(room);
    }

    @MessageMapping("/room/list")
    @SendTo("/topic/room/list")
    public List<RoomInfo> getRooms() {
        return roomService.getRoomList();
    }

    @MessageMapping("/room/start/{roomId}")
    @SendTo("/topic/room/start/{roomId}")
    public StartTaleMakingResponseDto start(@DestinationVariable String roomId) {
        return taleService.startMakingTale(Long.parseLong(roomId));
    }

    @MessageMapping("/active/invite")
    @SendTo("/active/invite")
    public RoomInviteResponseDto invite(RoomInviteRequestDto requestDto) {
        return taleService.invite(requestDto);
    }
    @MessageMapping("/room/escape/before/{roomId}")
    @SendTo("/topic/room/escape/before/{roomId}")
    public String escapeBefore(@DestinationVariable String roomId) {
        taleService.breakRoom(Long.parseLong(roomId));
        return "break";
    }

    @MessageMapping("/room/escape/after/{roomId}/{memberId}")
    @SendTo("/topic/room/escape/after/{roomId}")
    public void escapeAfter(@DestinationVariable String roomId, @DestinationVariable String memberId) {
        // 확인 처리.. 멤버 아이디 필요함...
    }
}
