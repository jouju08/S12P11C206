package com.ssafy.backend.tale.service;

import com.ssafy.backend.common.exception.BadRequestException;
import livekit.LivekitWebhook;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import io.livekit.server.AccessToken;
import io.livekit.server.RoomJoin;
import io.livekit.server.RoomName;
import io.livekit.server.WebhookReceiver;
import livekit.LivekitWebhook.WebhookEvent;
import org.springframework.web.bind.annotation.RequestBody;

@Service
public class LiveKitService {

    @Value("${livekit.api.key}")
    private String LIVEKIT_API_KEY;

    @Value("${livekit.api.secret}")
    private String LIVEKIT_API_SECRET;

    public String createToken(String roomId, String loginId){

        if (loginId == null || roomId == null) {
            throw new BadRequestException("잘못된 요청입니다.");
        }

        AccessToken token = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET);
        token.setName(loginId);
        token.setIdentity(loginId);
        token.addGrants(new RoomJoin(true), new RoomName(roomId));

        return token.toJwt();
    }

    public void validateToken(String authHeader, String body){
        WebhookReceiver webhookReceiver = new WebhookReceiver(LIVEKIT_API_KEY, LIVEKIT_API_SECRET);
        try {
            LivekitWebhook.WebhookEvent event = webhookReceiver.receive(body, authHeader);
            System.out.println("LiveKit Webhook: " + event.toString());
        } catch (Exception e) {
            throw new RuntimeException("Error validating webhook event: " + e.getMessage());
        }
    }


}
