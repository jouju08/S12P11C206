package com.ssafy.backend.tale.service;

import com.ssafy.backend.common.ApiResponse;
import com.ssafy.backend.common.CustomMultipartFile;
import com.ssafy.backend.common.S3Service;
import com.ssafy.backend.tale.dto.common.PromptSet;
import com.ssafy.backend.tale.dto.common.TaleMemberDto;
import com.ssafy.backend.tale.dto.request.*;
import com.ssafy.backend.tale.dto.response.DiffusionPromptResponseDto;
import com.ssafy.backend.tale.dto.response.GenerateTaleResponseDto;
import com.ssafy.backend.tale.dto.common.PageInfo;
import com.ssafy.backend.tale.dto.common.SentenceOwnerPair;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.ExchangeStrategies;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpHeaders;
import org.springframework.web.multipart.MultipartFile;
import reactor.netty.http.client.HttpClient;

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
    private final S3Service s3Service;

    public AIServerRequestService(@Value("${ai.server.url}") String url, TaleRoomNotiService taleRoomNotiService, TaleService taleService, S3Service s3Service) {
        this.webClient = WebClient.builder()
                .baseUrl(url)
                .exchangeStrategies(ExchangeStrategies.builder()
                        .codecs(configurer -> configurer
                                .defaultCodecs()
                                .maxInMemorySize(50 * 1024 * 1024)) // 10MB로 설정
                        .build())
                .clientConnector(new ReactorClientHttpConnector(HttpClient.create()))
                .build();
        this.taleRoomNotiService = taleRoomNotiService;
        this.taleService = taleService;
        this.s3Service = s3Service;
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

    public void requestAIPicture(long roomId){
        //웹소켓으로 동화 제작이 끝났음을 알림
        taleRoomNotiService.sendNotification("/topic/tale/" + roomId, "finish tale making");

        //각 페이지마다 ai 그림 생성 요청
        for(int i=0; i<4; i++){
            // AI 서버에 이미지를 보내기 위해 promptset과 original image url을 담은 dto를 생성
            TaleMemberDto taleMemberDto = taleService.getTaleMemberDtoFromRedis(roomId, i);
            byte[] originImage = s3Service.getFileAsBytes(taleMemberDto.getOrginImg());
            PromptSet promptSet = taleMemberDto.getPromptSet();
            AIPictureRequestDto aIPictureRequestDto = new AIPictureRequestDto(roomId, i, originImage, promptSet);

            webClient.post()
                    .uri("/gen/picture")
                    .bodyValue(aIPictureRequestDto)
                    .retrieve()
                    .bodyToMono(void.class)
                    .subscribe();
        }
    }

    private void handleGenerateTaleResponse(long roomId,GenerateTaleRequestDto generateTaleRequestDto, ApiResponse<GenerateTaleResponseDto> response){
//        System.out.println("success requestGenerateTale");
//        System.out.println("roomId = " + roomId);
//        System.out.println("response = " + response);
        // 완성된 동화를 redis에 저장
        List<PageInfo> pages = response.getData().getPages();
        System.out.println("pages = " + pages);
        List<SentenceOwnerPair> sentenceOwnerPairList =  taleService.saveTaleText(roomId, pages);
        //todo: websocket으로 알림
        taleRoomNotiService.sendNotification("/topic/tale/" + roomId, sentenceOwnerPairList);
        //todo: 프롬프트 생성 requestDiffusionPrompt-> taleService.saveTalePrompt(roomId, prompt);
        DiffusionPromptRequestDto diffusionPromptRequestDto = new DiffusionPromptRequestDto(generateTaleRequestDto.getTitle(), pages);
        requestDiffusionPrompt(roomId, diffusionPromptRequestDto);

        //todo: 음성 생성 requestVoiceScript->  s3에 저장 -> taleService.saveTaleVoice(roomId, voiceUrl);
        for(int i=0; i<4; i++)
            requestVoiceScript(roomId, i, pages.get(i));

    }

    private void requestDiffusionPrompt(long roomId, DiffusionPromptRequestDto diffusionPromptRequestDto){
        webClient.post()
                .uri("/gen/diffusion-prompts")
                .bodyValue(diffusionPromptRequestDto)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<ApiResponse<DiffusionPromptResponseDto>>(){})
                .subscribe(response -> taleService.saveTalePrompt(roomId, response.getData().getPrompts()));
    }


    private void requestVoiceScript(long roomId, int order, PageInfo pages) {
        VoiceScriptRequestDto voiceScriptRequestDto = new VoiceScriptRequestDto(pages.getFullText());

        webClient.post()
                .uri("/gen/script-read")
                .header(HttpHeaders.CONTENT_TYPE, "application/json")
                .bodyValue(voiceScriptRequestDto)
                .retrieve()
                .bodyToMono(DataBuffer.class)  // 바이너리 데이터로 받기
                .flatMap(dataBuffer -> convertToMultipartFile(dataBuffer, "voice_" + roomId + "_" + order + ".wav","audio/wav"))  // MultipartFile로 변환
                .subscribe(file -> taleService.saveTaleVoice(roomId, order, file)); // 저장된 파일 전달
    }

    private Mono<MultipartFile> convertToMultipartFile(DataBuffer dataBuffer, String fileName, String contentType) {
        return Mono.just(CustomMultipartFile.convertToMultipartFile(dataBuffer, fileName, contentType));
    }



    public String requestTest(){
        return webClient.get()
                .uri("")
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }
}
