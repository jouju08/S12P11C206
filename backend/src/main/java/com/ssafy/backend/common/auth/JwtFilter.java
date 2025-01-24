package com.ssafy.backend.common.auth;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.val;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Component
public class JwtFilter extends OncePerRequestFilter {
    @Override
    protected  void doFilterInternal(HttpServletRequest request,
                                     HttpServletResponse response,
                                     FilterChain filterChain) throws ServletException, IOException {
        Cookie[] cookies=request.getCookies();
        if(cookies==null){
            filterChain.doFilter(request, response);
            return;
        }
        String jwtCookie="";
        for(int i=0;i<cookies.length;i++) {
            if(cookies[i].getName().equals("jwt")) {
                jwtCookie=cookies[i].getValue();
                break;
            }
        }
        System.out.println(jwtCookie);
        Claims claim;
        try{
            claim=JwtUtil.extractToken(jwtCookie);
        }catch(Exception e){
            filterChain.doFilter(request, response);
            return;
        }
        String arr[] =claim.get("authorities").toString().split(",");
        List<SimpleGrantedAuthority> authorities= Arrays.stream(arr).map(SimpleGrantedAuthority::new).toList();
        val customUser=new CustomUser(
                claim.get("loginId").toString(),"none",authorities
        );
        customUser.nickName=claim.get("nickname").toString();
        val authToken=new UsernamePasswordAuthenticationToken(
                customUser,""
        );
        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(authToken);




        filterChain.doFilter(request, response);
    }
}
