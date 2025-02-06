package com.ssafy.backend.common;


import java.util.Map;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;


@Service
public class OpenViduService {

//    @Value("${OPENVIDU_URL}")
//    private String OPENVIDU_URL;
//
//    @Value("${OPENVIDU_SECRET}")
//    private String OPENVIDU_SECRET;
//
//    private OpenVidu openvidu;
//
//    @PostConstruct
//    public void init() {
//        this.openvidu = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);
//    }
//
//    public Session createSession(Map<String, Object> params) throws OpenViduJavaClientException, OpenViduHttpException {
//        SessionProperties properties = SessionProperties.fromJson(params).build();
//        return openvidu.createSession(properties);
//    }
//
//    public String createConnection(String sessionId, Map<String, Object> params)
//            throws OpenViduJavaClientException, OpenViduHttpException {
//        Session session = openvidu.getActiveSession(sessionId);
//        if (session == null) {
//            // In a real application, you might throw a custom exception here.
//            return null;
//        }
//        ConnectionProperties properties = ConnectionProperties.fromJson(params).build();
//        Connection connection = session.createConnection(properties);
//        return connection.getToken();
//    }
}
