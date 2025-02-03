package com.ssafy.backend.tale.controller;

import com.ssafy.backend.common.OpenViduService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/openvidu")
//@CrossOrigin(origins = "*")
public class OpenViduController {

    private final OpenViduService openViduService;

    @Autowired
    public OpenViduController(OpenViduService openViduService) {
        this.openViduService = openViduService;
    }

    /**
     * 임시 테스트용 기반 접속 포인트
     * 클라이언트가 접속 토큰을 받기 위해 호출하는 엔드포인트.
     * 4명의 사용자 각각 이 API를 호출하면 동일한 세션에 접속하게 됨.
     *
     * TODO: 그림그리기 방에 따라서 방의 토큰을 분리 시켜주어야 함.
     */
    @PostMapping("/get-token")
    public ResponseEntity<String> getToken() {
        try {
            String token = openViduService.createConnectionToken();
            System.out.println(token);
            return ResponseEntity.ok(token);
        } catch (Exception e) {
            // 에러가 발생하면 적절한 에러 메시지와 함께 500 상태코드를 리턴
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error generating token: " + e.getMessage());
        }
    }
}
