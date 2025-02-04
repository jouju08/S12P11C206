package com.ssafy.backend.common;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

/**
 * author : HEO-hyunjun
 * date : 2025.01.31
 * description : 동화 제작 관련 서비스로, 동화 방에 websocket으로 알림을 보내는 서비스
 */
@Service
@RequiredArgsConstructor
public class WebSocketNotiService {
    private final SimpMessagingTemplate messagingTemplate;
    public void sendNotification(String destination, Object message) {
        messagingTemplate.convertAndSend(destination, message);
    }
}
