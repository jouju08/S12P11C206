package com.ssafy.backend.tale.controller;

import com.ssafy.backend.common.ApiResponse;
import com.ssafy.backend.tale.dto.common.RoomInfo;
import com.ssafy.backend.tale.service.LiveKitService;
import com.ssafy.backend.tale.service.RoomService;
import io.livekit.server.WebhookReceiver;
import livekit.LivekitWebhook;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class RoomRestController {
    private final RoomService roomService;
    private final LiveKitService liveKitService;

    @GetMapping("/tale/rooms")
    public ApiResponse<List<RoomInfo>> getAllRooms() {
        return ApiResponse.<List<RoomInfo>>builder().data(roomService.getRoomList()).build();
    }

    @GetMapping("/tale/room/token")
    public ApiResponse<String> getRoomToken(Authentication authentication, @RequestParam String roomId) {
        return ApiResponse.<String>builder().data(liveKitService.createToken(roomId, authentication.getName())).build();
    }

    @PostMapping(value = "/livekit/webhook", consumes = "application/webhook+json")
    public ResponseEntity<String> receiveWebhook(@RequestHeader("Authorization") String authHeader, @RequestBody String body) {
        liveKitService.validateToken(authHeader, body);
        // livekit 서버에 보내는 응답이므로 공통 객체 X
        return ResponseEntity.ok("ok");
    }
}
