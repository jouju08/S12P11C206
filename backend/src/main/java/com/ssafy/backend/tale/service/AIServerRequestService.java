package com.ssafy.backend.tale.service;

import com.ssafy.backend.common.ApiResponse;
import com.ssafy.backend.tale.dto.request.DiffusionPromptRequestDto;
import com.ssafy.backend.tale.dto.request.GenerateTaleRequestDto;
import com.ssafy.backend.tale.dto.request.PromptSet;
import com.ssafy.backend.tale.dto.response.GenerateTaleResponseDto;
import com.ssafy.backend.tale.dto.response.PageInfo;
import com.ssafy.backend.tale.dto.response.SentenceOwnerPair;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;

/**
 * author : HEO-hyunjun
 * date : 2025.01.31
 * description : AI 서버에 요청을 보내는 서비스
 * update
 *
 */
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
//        System.out.println("start requestGenerateTale");
        webClient.post()
                .uri("/gen/tale")
                .bodyValue(generateTaleRequestDto)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<ApiResponse<GenerateTaleResponseDto>>(){})
                .subscribe(
                        response -> handleGenerateTaleResponse(roomId, response)
                );
    }

    private void handleGenerateTaleResponse(long roomId, ApiResponse<GenerateTaleResponseDto> response){
//        System.out.println("success requestGenerateTale");
//        System.out.println("roomId = " + roomId);
//        System.out.println("response = " + response);
        // 완성된 동화를 redis에 저장
        List<PageInfo> pages = response.getData().getPages();
        List<SentenceOwnerPair> sentenceOwnerPairList =  taleService.saveTaleText(roomId, pages);
        //todo: websocket으로 알림
        taleRoomNotiService.sendNotification("/topic/tale/" + roomId, sentenceOwnerPairList);
        //todo: 프롬프트 생성 requestDiffusionPrompt-> taleService.saveTalePrompt(roomId, prompt);
//        List<PromptSet> promptSetList = requestDiffusionPrompt();

        //todo: 음성 생성 requestVoiceScript->  s3에 저장 -> taleService.saveTaleVoice(roomId, voiceUrl);
    }

    private List<PromptSet> requestDiffusionPrompt(DiffusionPromptRequestDto diffusionPromptRequestDto){
        return webClient.post()
                .uri("/gen/diffusion-prompts")
                .bodyValue(diffusionPromptRequestDto)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<ApiResponse<List<PromptSet>>>(){})
                .block().getData();
    }

    public String requestTest(){
        return webClient.get()
                .uri("")
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }
}
