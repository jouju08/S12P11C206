package com.ssafy.backend.config;

import com.ssafy.backend.common.service.AccessLogService;
import com.ssafy.backend.db.entity.AccessLog;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.LocalDateTime;

/**
 *  author : lee youngjae
 *  date : 2025.02.18
 *  description : 로그인 로깅을 위한 필터
 *  update
 *      1.
 * */

@Component
@RequiredArgsConstructor
public class AccessLogFilter extends OncePerRequestFilter {
    private final AccessLogService accessLogService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // 요청 정보를 수집
        String requestUrl = request.getRequestURI();
        String method = request.getMethod();
        String ipAddress = request.getRemoteAddr();

        AccessLog log = new AccessLog();
        log.setRequestUrl(requestUrl);
        log.setMethod(method);
        log.setIpAddress(ipAddress);
        log.setTimestamp(LocalDateTime.now());

        // 로그 저장 (필요에 따라 비동기로 처리할 수도 있음)
        accessLogService.saveLog(log);

        // 다음 필터로 체인 진행
        filterChain.doFilter(request, response);
    }
}
