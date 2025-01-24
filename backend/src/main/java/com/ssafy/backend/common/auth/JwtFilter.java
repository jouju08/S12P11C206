package com.ssafy.backend.common.auth;

import com.ssafy.backend.common.exception.UnauthorizedException;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
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
import java.util.Date;
import java.util.List;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            filterChain.doFilter(request, response);
            return;
        }

        // Access 토큰 쿠키에서 꺼내기
        String token = Arrays.stream(cookies)
                .filter(c -> "accessToken".equals(c.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse("");

        if (token.isEmpty()) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            Claims claims = JwtUtil.extractToken(token);
            Date expiration = claims.getExpiration();
            if (expiration.before(new Date())) {
                throw new UnauthorizedException("만료된 토큰입니다.");
            }

            String[] roles = claims.get("authorities").toString().split(",");
            List<SimpleGrantedAuthority> authorities =
                    Arrays.stream(roles)
                            .map(SimpleGrantedAuthority::new)
                            .toList();

            CustomUser customUser = new CustomUser(
                    claims.get("loginId").toString(),
                    "none",
                    authorities
            );
            customUser.setNickName(claims.get("nickname").toString());

            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(customUser, null, authorities);
            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authToken);

        } catch (ExpiredJwtException e) {
            // 만료된 토큰일 경우
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "만료된 토큰입니다.");
            return;
        } catch (JwtException e) {
            // 토큰 변조 혹은 시그니처 문제
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "유효하지 않은 토큰입니다.");
            return;
        }

        filterChain.doFilter(request, response);
    }
}

