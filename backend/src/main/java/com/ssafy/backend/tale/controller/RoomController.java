package com.ssafy.backend.tale.controller;

import com.ssafy.backend.tale.dto.common.Room;
import com.ssafy.backend.tale.dto.request.JoinRoomRequestDto;
import com.ssafy.backend.tale.dto.request.LeaveRoomRequestDto;
import com.ssafy.backend.tale.dto.request.MakeRoomRequestDto;
import com.ssafy.backend.tale.dto.common.RoomInfo;
import com.ssafy.backend.tale.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

/*
 *  author : park byeongju
 *  date : 2025.01.23
 *  description : 동화 만들기 Room 컨트롤러, 
 *                방 만들기, 참여하기, 나가기, 방 조회, 방리스트(TODO)
 *  update
 *      1.
 * */
@Controller
@RequiredArgsConstructor
public class RoomController {
    private final RoomService roomService;
    private final SimpMessagingTemplate messagingTemplate;


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
    public String start(@PathVariable String roomId, Room room) {
        String destination = "/topic/room/start/" + roomId;
        String message = "start";
        messagingTemplate.convertAndSend(destination, message);
        // 시작하는 신호
        // 방 정리
        roomService.deleteRoom(Long.parseLong(roomId));
        return message;
    }
}
