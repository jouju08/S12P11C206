package com.ssafy.backend.common.auth;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@AllArgsConstructor
public class KakaoUserInfo {
    private String loginId;
    private String nickname;
}
