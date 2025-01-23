package com.ssafy.backend.member.controller;

import com.ssafy.backend.common.ApiResponse;
import com.ssafy.backend.common.ControllerExceptionHandler;
import com.ssafy.backend.common.ResponseCode;
import com.ssafy.backend.common.auth.JwtUtil;
import com.ssafy.backend.common.exception.BadRequestException;
import com.ssafy.backend.db.entity.Member;
import com.ssafy.backend.dto.EmailRequestDto;
import com.ssafy.backend.dto.FindIdDto;
import com.ssafy.backend.member.service.AuthenticationService;
import com.ssafy.backend.member.service.EmailSendService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.val;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor
public class AuthController {
    private final AuthenticationService authenticationService;
    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final ControllerExceptionHandler exceptionHandler;
    private final EmailSendService emailSendService;
    //회원가입
    @PostMapping("/register")   //말 그대로 회원 가입
    public ApiResponse<Object> register(
            @Valid @RequestBody Member member) {
        authenticationService.register(member);
        return ApiResponse.builder().data("성공").build();
    }

    @PostMapping("/login/jwt")
    @ResponseBody
    public Map<String, String> loginJwt(@RequestBody Map<String, String> data,
                                        HttpServletResponse response) {
        System.out.println("authToken");
        val authToken = new UsernamePasswordAuthenticationToken(data.get("loginId"), data.get("password"));
        System.out.println(authToken);
        val auth = authenticationManagerBuilder.getObject().authenticate(authToken);
        System.out.println("authToken2");
        SecurityContextHolder.getContext().setAuthentication(auth);
        System.out.println("authToken3");
        val jwt = JwtUtil.createToken(SecurityContextHolder.getContext().getAuthentication());//함수 계속 재사용하는거라 단순 계산에만 사용
        var cookie = new Cookie("jwt", jwt);
        System.out.println("authToken4");
        cookie.setMaxAge(10);//쿠키 수명
        cookie.setHttpOnly(true);//쿠키 가로채기 금지
        cookie.setPath("/");//쿠키가 전송될 경로
        response.addCookie(cookie);
        Map<String, String> map = new HashMap<>();
        map.put("token", jwt);
        return map;
    }

    @GetMapping("/logout")
    @ResponseBody
    public ResponseEntity<String> logout(HttpServletRequest request, HttpServletResponse response) {

        //쿠키 삭제
        Cookie cookie = new Cookie("token", null);
        cookie.setMaxAge(0); // 쿠키를 즉시 만료시킴
        cookie.setPath("/");  // 쿠키의 경로 설정
        response.addCookie(cookie);
        return ResponseEntity.ok("로그아웃되었습니다.");
    }

    @GetMapping("/check-id/{loginId}")
    public ApiResponse<Object> isDuplicatedId(@PathVariable String loginId) {
        Optional<Member> member = authenticationService.findByLoginId(loginId);
        if (member.isPresent()) {
            return ApiResponse.builder()
                    .data("Duplicated id")
                    .status(ResponseCode.DUPLICATE_ID)
                    .message("이미 사용중인 ID")
                    .build();
        }
        else {
            return ApiResponse.builder().data("사용 가능").build();
        }
    }


    @GetMapping("/check-email/{email}")
    public ApiResponse<Object> isDuplicatedEmail(@PathVariable String email){
        Optional<Member> member = authenticationService.findByEmail(email);
        if(member.isPresent()){
            return ApiResponse.builder()
                    .data("Duplicated email")
                    .status(ResponseCode.DUPLICATE_EMAIL)
                    .message("이미 사용중인 EMAIL")
                    .build();
        }
        else{
            return ApiResponse.builder().data("사용 가능한 email").build();
        }
    }

    @GetMapping("/check-nickname/{nickname}")
    public ApiResponse<Object> isDuplicatedNickname(@PathVariable String nickname){
        Optional<Member> member = authenticationService.findByNickname(nickname);
        if(member.isPresent()){
            return ApiResponse.builder()
                    .data("Duplicated Nickname")
                    .status(ResponseCode.DUPLICATE_NICKNAME)
                    .message("이미 사용중인 NICKNAME")
                    .build();
        }
        else{
            return ApiResponse.builder().data("사용 가능한 nickname").build();
        }
    }


    @PostMapping("/find-id")
    public ApiResponse<Object> mailSend(@RequestBody @Valid FindIdDto findIdDto) {
        String email = findIdDto.getEmail();
        String birth = findIdDto.getBirth();
        boolean exists = authenticationService.isMemberExists(email, birth);
        if (exists) {
            String loginID=emailSendService.findIdEmail(email);
            return ApiResponse.builder()
                    .data("사용자가 존재합니다.")
                    .build();
        }
        else {
            return ApiResponse.builder()
                    .data("Not Found")
                    .status(ResponseCode.NOT_FOUND)
                    .message("회원 조회 실패")
                    .build();

        }
    }



}
