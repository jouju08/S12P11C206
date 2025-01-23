package com.ssafy.backend.member.controller;

import com.ssafy.backend.common.ApiResponse;
import com.ssafy.backend.common.auth.JwtUtil;
import com.ssafy.backend.db.entity.Member;
import com.ssafy.backend.member.service.AuthenticationService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.val;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor
public class AuthController {
    private final AuthenticationService authenticationService;
    private final AuthenticationManagerBuilder authenticationManagerBuilder;

    //회원가입
    @PostMapping("/register")   //말 그대로 회원 가입
    public ApiResponse<Object> register(
            @Valid @RequestBody Member member){
        authenticationService.register(member);
        return ApiResponse.builder().data("성공").build();
    }

    @PostMapping("/login/jwt")
    @ResponseBody
    public Map<String, String> loginJwt(@RequestBody Map<String, String> data,
                                        HttpServletResponse response) {
        System.out.println("authToken");
        val authToken=new UsernamePasswordAuthenticationToken(data.get("loginId"), data.get("password"));
        System.out.println(authToken);
        val auth=authenticationManagerBuilder.getObject().authenticate(authToken);
        System.out.println("authToken2");
        SecurityContextHolder.getContext().setAuthentication(auth);
        System.out.println("authToken3");
        val jwt= JwtUtil.createToken(SecurityContextHolder.getContext().getAuthentication());//함수 계속 재사용하는거라 단순 계산에만 사용
        var cookie=new Cookie("jwt",jwt);
        System.out.println("authToken4");
        cookie.setMaxAge(10);//쿠키 수명
        cookie.setHttpOnly(true);//쿠키 가로채기 금지
        cookie.setPath("/");//쿠키가 전송될 경로
        response.addCookie(cookie);
        Map<String,String> map=new HashMap<>();
        map.put("token",jwt);
        return map;
    }

}
