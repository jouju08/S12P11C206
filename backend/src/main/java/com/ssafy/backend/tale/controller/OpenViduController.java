package com.ssafy.backend.tale.controller;

import java.util.Map;

import com.ssafy.backend.common.OpenViduService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.openvidu.java.client.OpenViduHttpException;
import io.openvidu.java.client.OpenViduJavaClientException;
import io.openvidu.java.client.Session;


@RestController
@RequestMapping("/api/share")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class OpenViduController {

    private final OpenViduService openViduService;

    /**
     * 임시 테스트용 기반 접속 포인트
     * 클라이언트가 접속 토큰을 받기 위해 호출하는 엔드포인트.
     * 4명의 사용자 각각 이 API를 호출하면 동일한 세션에 접속하게 됨.
     *
     * TODO: 그림그리기 방에 따라서 방의 토큰을 분리 시켜주어야 함.
     */
//    @PostMapping("/get-token")
//    public ResponseEntity<String> getToken() {
//        try {
//            String token = openViduService.createConnectionToken();
//            System.out.println(token);
//            return ResponseEntity.ok(token);
//        } catch (Exception e) {
//            // 에러가 발생하면 적절한 에러 메시지와 함께 500 상태코드를 리턴
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body("Error generating token: " + e.getMessage());
//        }
//    }

    @PostMapping("/sessions")
    public ResponseEntity<String> initializeSession(
            @RequestBody(required = false) Map<String, Object> params)
            throws OpenViduJavaClientException, OpenViduHttpException {
        System.out.println("Initializing session with params: " + params);
        Session session = openViduService.createSession(params);
        return new ResponseEntity<>(session.getSessionId(), HttpStatus.OK);
    }

    @PostMapping("/sessions/{sessionId}/connections")
    public ResponseEntity<String> createConnection(@PathVariable("sessionId") String sessionId,
                                                   @RequestBody(required = false) Map<String, Object> params)
            throws OpenViduJavaClientException, OpenViduHttpException {
        System.out.println("Creating connection for session: " + sessionId);
        String token = openViduService.createConnection(sessionId, params);
        if (token == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(token, HttpStatus.OK);
    }
}
