package com.ssafy.backend.tale.controller;

import com.ssafy.backend.common.ApiResponse;
import com.ssafy.backend.tale.dto.response.RoomInfo;
import com.ssafy.backend.tale.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class RoomRestController {
    private final RoomService roomService;

    @GetMapping("/tale/rooms")
    public ApiResponse<List<RoomInfo>> getAllRooms() {
        return ApiResponse.<List<RoomInfo>>builder().data(roomService.getRoomList()).build();
    }
}
