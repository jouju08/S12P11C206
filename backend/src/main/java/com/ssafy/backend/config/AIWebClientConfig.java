package com.ssafy.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.function.client.ExchangeStrategies;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;

@Configuration
public class AIWebClientConfig {
    @Value("${AI_SERVER_URL}")
    private String url;

    public WebClient webClient() {
        return WebClient.builder()
                .baseUrl(url)
                .exchangeStrategies(ExchangeStrategies.builder()
                        .codecs(configurer -> configurer
                                .defaultCodecs()
                                .maxInMemorySize(50 * 1024 * 1024)) // 10MB로 설정
                        .build())
                .clientConnector(new ReactorClientHttpConnector(HttpClient.create()))
                .build();
    }
}
