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
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.List;

/**
 * author : HEO-hyunjun
 * date : 2025.01.31
 * description : AI 서버에 요청을 보내는 서비스
 * update
 *  1. handleGenerateTaleResponse 메소드에 ai 서버로부터 받은 응답을 처리하는 로직 추가 (2025.02.02) todo : 테스트, websocket으로 알림
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
                        response -> handleGenerateTaleResponse(roomId, generateTaleRequestDto, response)
                );
    }

    private void handleGenerateTaleResponse(long roomId,GenerateTaleRequestDto generateTaleRequestDto, ApiResponse<GenerateTaleResponseDto> response){
//        System.out.println("success requestGenerateTale");
//        System.out.println("roomId = " + roomId);
//        System.out.println("response = " + response);
        // 완성된 동화를 redis에 저장
        List<PageInfo> pages = response.getData().getPages();
        List<SentenceOwnerPair> sentenceOwnerPairList =  taleService.saveTaleText(roomId, pages);
        //todo: websocket으로 알림
        taleRoomNotiService.sendNotification("/topic/tale/" + roomId, sentenceOwnerPairList);
        //todo: 프롬프트 생성 requestDiffusionPrompt-> taleService.saveTalePrompt(roomId, prompt);
        DiffusionPromptRequestDto diffusionPromptRequestDto = new DiffusionPromptRequestDto(generateTaleRequestDto.getTitle(), pages);
        List<PromptSet> promptSetList = requestDiffusionPrompt(diffusionPromptRequestDto);
        taleService.saveTalePrompt(roomId, promptSetList);

        //todo: 음성 생성 requestVoiceScript->  s3에 저장 -> taleService.saveTaleVoice(roomId, voiceUrl);
        List<MultipartFile> voiceScriptList = requestVoiceScript(pages);
        taleService.saveTaleVoice(roomId, voiceScriptList);
    }

    private List<PromptSet> requestDiffusionPrompt(DiffusionPromptRequestDto diffusionPromptRequestDto){
        return webClient.post()
                .uri("/gen/diffusion-prompts")
                .bodyValue(diffusionPromptRequestDto)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<ApiResponse<List<PromptSet>>>(){})
                .block().getData();
    }

    private List<MultipartFile> requestVoiceScript(List<PageInfo> pages){
        List<MultipartFile> voiceScriptList = new ArrayList<>();
        for (PageInfo page : pages) {
            MultipartFile voice = webClient.post()
                    .uri("/gen/script-read")
                    .bodyValue(page.getFullText())
                    .retrieve()
                    .bodyToMono(MultipartFile.class)
                    .block();

            if (voice != null) { // null 체크 추가 (에러 방지)
                voiceScriptList.add(voice);
            }
        }
        return voiceScriptList; // 결과 리스트 반환
    }

    public String requestTest(){
        return webClient.get()
                .uri("")
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }
}
