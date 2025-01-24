package com.ssafy.backend.member.service;

import com.ssafy.backend.common.exception.BadRequestException;
import com.ssafy.backend.db.entity.Member;
import com.ssafy.backend.db.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthenticationService {
    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;


    public void register(@RequestBody Member request) {
        if (memberRepository.findByLoginId(request.getLoginId()).isPresent()) {
            throw new BadRequestException("이미 사용중인 아이디입니다");
        }
        if (memberRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new BadRequestException("이미 사용중인 이메일입니다");
        }
        try {
            Member user = Member.builder()
                    .email(request.getEmail())
                    .loginId(request.getLoginId())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .nickname(request.getNickname())
                    .isDeleted(false)
                    .profileImg(request.getProfileImg())
                    .loginType(request.getLoginType())
                    .birth(request.getBirth())
                    .build();
            memberRepository.save(user);
        }catch (Exception e) {
            throw new BadRequestException("잘못된 요청입니다");
        }
    }
    public Optional<Member> findByLoginId(String loginId) {
        return memberRepository.findByLoginId(loginId);
    }

    public Optional<Member> findByEmail(String email) {
        return memberRepository.findByEmail(email);
    }

    public Optional<Member> findByNickname(String nickname) {
        return memberRepository.findByNickname(nickname);
    }

    public boolean isMemberExists(String email, String birth) {
        return memberRepository.findByEmailAndBirth(email, birth).isPresent();
    }
}
