package com.ssafy.backend.tale.service;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TaleRoomNotiService {
    private final SimpMessagingTemplate messagingTemplate;
    private String baseDestination = "/topic/tale/";
    public void sendNotification(String destination, Object message) {
        messagingTemplate.convertAndSend(destination, message);
    }
}
