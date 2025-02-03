package com.ssafy.backend.common;


import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.openvidu.java.client.Connection;
import io.openvidu.java.client.ConnectionProperties;
import io.openvidu.java.client.OpenVidu;
import io.openvidu.java.client.OpenViduHttpException;
import io.openvidu.java.client.OpenViduJavaClientException;
import io.openvidu.java.client.Session;
import io.openvidu.java.client.SessionProperties;

@Service
public class OpenViduService {

    @Value("${OPENVIDU_URL}")
    private String openviduUrl;

    @Value("${OPENVIDU_SECRET}")
    private String openviduSecret;

    private OpenVidu openVidu;

    // 단일 세션을 생성하여 4명의 사용자에게 동일 세션에서 접속토큰을 부여하는 예시
    private Session session;

    /*
        Spring은 bean을 초기화 한 이후에 @PostConstruct을 한번만 호출한다.
        즉 @PostConstruct는 WAS 가 뜰 때 bean이 생성된 다음 딱 한번만 실행된다.
        따라서 @PostConstruct 를 사용하여 기본 사용자라던가, 딱 한번만 등록하면 되는 key 값 등을 등록하여 사용할 수 있다.
     */
    @PostConstruct
    public void init() {
        this.openVidu = new OpenVidu(openviduUrl, openviduSecret);
    }

    /**
     * 세션이 없으면 새로 생성, 이미 생성되어 있다면 기존 세션을 리턴
     */
    public synchronized Session getSession() throws OpenViduJavaClientException, OpenViduHttpException {
        if (this.session == null) {
            // SessionProperties.Builder를 사용하여 세션 속성 생성
            SessionProperties.Builder builder = new SessionProperties.Builder();
            SessionProperties properties = builder.build();

            // OpenVidu 서버에서 세션 생성
            this.session = this.openVidu.createSession(properties);
        }
        return this.session;
    }

    /**
     * 새로운 연결(접속 토큰)을 생성
     */
    public String createConnectionToken() throws OpenViduJavaClientException, OpenViduHttpException {
        Session currentSession = getSession();

        // ConnectionProperties.Builder를 사용하여 연결 속성 생성
        ConnectionProperties.Builder builder = new ConnectionProperties.Builder();
        ConnectionProperties connectionProperties = builder.build();

        // 세션에 연결 생성 및 토큰 반환
        Connection connection = currentSession.createConnection(connectionProperties);
        return connection.getToken();
    }
}
