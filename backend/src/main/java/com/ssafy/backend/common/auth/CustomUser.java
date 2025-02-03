package com.ssafy.backend.common.auth;

import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

public class CustomUser extends org.springframework.security.core.userdetails.User{
    public String nickName;

    public CustomUser(
            String memberId,
            String password,
            Collection<? extends GrantedAuthority> authorities
    ) {
        super(memberId, password, authorities);
    }
    public String getNickName() {
        return nickName;
    }

    public void setNickName(String nickName) {
        this.nickName = nickName;
    }

}
