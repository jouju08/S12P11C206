package com.ssafy.backend.member.controller;

import com.ssafy.backend.common.ApiResponse;
import com.ssafy.backend.common.auth.JwtUtil;
import com.ssafy.backend.db.entity.Member;
//import com.ssafy.backend.member.service.MemberService;
import com.ssafy.backend.member.service.AuthenticationService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.val;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/member")
@AllArgsConstructor
public class MemberController {
//    @Autowired
//    private MemberService memberService;
//
//    @GetMapping("/mypage")
//    public ApiResponse<Member> getMember(@PathVariable("memberId") String memberId) {
//        Member member = new Member();
//
//        memberService.tryCatchGetMember(memberId);
//
//        return ApiResponse.<Member>builder()
//                .data(member)
//                .build();
//    }
}
