package com.ssafy.backend.tale.service;

import com.ssafy.backend.common.ApiResponse;
import com.ssafy.backend.tale.dto.request.GenerateTaleRequestDto;
import com.ssafy.backend.tale.dto.response.GenerateTaleResponseDto;
import com.ssafy.backend.tale.dto.response.PageInfo;
import com.ssafy.backend.tale.dto.response.SentenceOwnerPair;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;

@Service
public class AIServerRequestService {
    private final WebClient webClient;
    private final TaleRoomNotiService taleRoomNotiService;
    private final TaleService taleService;

    public AIServerRequestService(WebClient.Builder webClientBuilder,
                                  @Value("${ai.server.url}") String url, TaleRoomNotiService taleRoomNotiService, TaleService taleService) {
        this.webClient = webClientBuilder.baseUrl(url).build();
        this.taleRoomNotiService = taleRoomNotiService;
        this.taleService = taleService;
    }

    public void requestGenerateTale(long roomId, GenerateTaleRequestDto generateTaleRequestDto){
        webClient.post()
                .uri("/generate")
                .bodyValue(generateTaleRequestDto)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<ApiResponse<GenerateTaleResponseDto>>(){})
                .subscribe(
                        response -> handleGenerateTaleResponse(roomId,response)
                );
    }

    private void handleGenerateTaleResponse(long roomId, ApiResponse<GenerateTaleResponseDto> response){
        List<PageInfo> pages = response.getData().getPages();
        List<SentenceOwnerPair> sentenceOwnerPairList =  taleService.saveTaleInfo(roomId, pages);
        taleRoomNotiService.sendNotification("/topic/tale/" + roomId, sentenceOwnerPairList);
    }

    public String requestTest(){
        return webClient.get()
                .uri("")
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }
}
