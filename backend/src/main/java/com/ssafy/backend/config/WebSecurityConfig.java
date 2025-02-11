package com.ssafy.backend.config;

import com.ssafy.backend.common.auth.JwtAuthenticationEntryPoint;
import com.ssafy.backend.common.auth.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.core.annotation.Order;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/*
 *  author : park byeongju
 *  date : 2025.01.17
 *  description : 스프링 시큐리티 설정 파일
 *  update
 *      1.
 * */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class WebSecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    // CORS 설정을 별도의 Bean으로 분리
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("https://i12c206.p.ssafy.io:3000", "http://localhost:3000", "https://i12c206.p.ssafy.io", "http://192.168.100.136:3000", "http://172.30.1.84:3000")); // 허용할 Origin 설정
        config.setAllowedMethods(List.of("GET", "POST","PATCH", "PUT", "DELETE", "OPTIONS", "MESSAGE")); // 허용할 HTTP 메서드 설정
        config.setAllowedHeaders(List.of("*")); // 모든 헤더 허용
        config.setAllowCredentials(true); // 인증 정보 허용
        config.setMaxAge(3600L); // Preflight 요청 캐시 시간 설정

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    @Order(1)
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Bean 참조
                // 인증 실패 시 대응 핸들러 (401 응답 등)
                .exceptionHandling(ex -> ex.authenticationEntryPoint(jwtAuthenticationEntryPoint))
                // 세션 정책: JWT를 사용한다면 항상 STATELESS1
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/register", "/api/auth/login", "/api/auth/refresh").permitAll()
                        .requestMatchers("/api/auth/logout", "/api/auth/kakao/callback").permitAll()
                        .requestMatchers("/api/auth/duplicate/**", "/api/auth/email/**").permitAll()
                        .requestMatchers("/ws/**").permitAll() // 임시로 다 열기
                        .requestMatchers(request -> {
                            String host = request.getHeader("Host");
                            return host != null && (host.equals("tinker-backend") || host.startsWith("tinker-backend:"));
                        }).permitAll()
                        .anyRequest().authenticated())
//                .oauth2Login(oauth -> oauth
//                        .defaultSuccessUrl("/api/auth/kakao/callback")
//                ) // 인증 성공 후 처리 경로
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);        // JWT 필터 추가
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration
    ) throws Exception {
        return configuration.getAuthenticationManager();
    }
}


