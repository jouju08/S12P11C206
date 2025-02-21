package com.ssafy.backend.common.auth;

import com.ssafy.backend.db.entity.Member;
import com.ssafy.backend.db.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 *  author : park byeongju
 *  date : 2025.01.25
 *  description : UserDetailsService에 대한 구현체
 *  update
 *      1. 파일 위치 변경 및 빈 주입 방식 통일 (25.02.18)
 * */

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final MemberRepository memberRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // 데이터베이스에서 사용자 조회
        Member member = memberRepository.findByLoginId(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
        if(member.getPassword() == null || member.getPassword().equals("")){
            member.setPassword("");
        }
        // UserDetails 객체 반환
        return org.springframework.security.core.userdetails.User.builder()
                .username(member.getLoginId())
                .password(member.getPassword()) // 암호화된 비밀번호
                .roles("USER") // 권한 설정 (예: USER)
                .build();
    }
}

