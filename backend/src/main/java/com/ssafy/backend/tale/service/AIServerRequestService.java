package com.ssafy.backend.tale.service;

import com.ssafy.backend.common.*;
import com.ssafy.backend.common.dto.ApiResponse;
import com.ssafy.backend.common.exception.BadRequestException;
import com.ssafy.backend.common.service.S3Service;
import com.ssafy.backend.common.service.WebSocketNotiService;
import com.ssafy.backend.common.util.CustomMultipartFile;
import com.ssafy.backend.db.entity.TaleMember;
import com.ssafy.backend.tale.dto.common.PromptSet;
import com.ssafy.backend.tale.dto.common.TaleMemberDto;
import com.ssafy.backend.tale.dto.request.*;
import com.ssafy.backend.tale.dto.response.DiffusionPromptResponseDto;
import com.ssafy.backend.tale.dto.response.GenerateTaleResponseDto;
import com.ssafy.backend.tale.dto.common.PageInfo;
import com.ssafy.backend.tale.dto.common.SentenceOwnerPair;

import com.ssafy.backend.tale.dto.response.TaleSentencesResponseDto;
import com.ssafy.backend.tale.dto.response.TextResponseDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.ExchangeStrategies;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpHeaders;
import org.springframework.web.multipart.MultipartFile;
import reactor.netty.http.client.HttpClient;

import javax.sound.sampled.AudioFileFormat;
import javax.sound.sampled.AudioFormat;
import javax.sound.sampled.AudioSystem;
import javax.sound.sampled.UnsupportedAudioFileException;
import java.io.BufferedInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

/**
 * author : HEO-hyunjun
 * date : 2025.01.31
 * description : AI 서버에 요청을 보내는 서비스
 * update
 *  1. handleGenerateTaleResponse 메소드에 ai 서버로부터 받은 응답을 처리하는 로직 추가 (2025.02.02)
 *  2. requestAIPicture 메소드 추가 / voice, handwrite keyword 요청 메소드 추가 (2025.02.02)
 */
@Service
public class AIServerRequestService {
    private final WebClient webClient;
    private final WebSocketNotiService webSocketNotiService;
    private final TaleService taleService;
    private final S3Service s3Service;

    public AIServerRequestService(@Value("${AI_SERVER_URL}") String url, WebSocketNotiService webSocketNotiService, TaleService taleService, S3Service s3Service) {
        this.webClient = WebClient.builder()
                .baseUrl(url)
                .exchangeStrategies(ExchangeStrategies.builder()
                        .codecs(configurer -> configurer
                                .defaultCodecs()
                                .maxInMemorySize(50 * 1024 * 1024)) // 10MB로 설정
                        .build())
                .clientConnector(new ReactorClientHttpConnector(HttpClient.create()))
                .build();
        this.webSocketNotiService = webSocketNotiService;
        this.taleService = taleService;
        this.s3Service = s3Service;
    }

    public void requestGenerateTale(long roomId, GenerateTaleRequestDto generateTaleRequestDto){
        webClient.post()
                .uri("/gen/tale")
                .bodyValue(generateTaleRequestDto)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<ApiResponse<GenerateTaleResponseDto>>(){})
                .subscribe(
                        response -> handleGenerateTaleResponse(roomId, generateTaleRequestDto, response)
                );
    }

    public ApiResponse<Boolean> isAIPictureServerAlive(){
        try {
            ApiResponse<Boolean> response = webClient.get()
                    .uri("/ask/can-draw-picture")
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<ApiResponse<Boolean>>() {
                    })
                    .block();
            String message = null;
            if (response.getData()) {
                message = "외부 FastAPI서버가 열려있습니다.";
            } else {
                message = "외부 FastAPI서버가 닫혀있습니다.";
            }
            response.setMessage(message);

            return response;
        } catch (Exception e) {
            return ApiResponse.<Boolean>builder().message("로컬 FastAPI서버가 닫혀있습니다.").data(false).build();
        }
    }

    public void requestAIPicture(long roomId){
        //각 페이지마다 ai 그림 생성 요청
        TaleMemberDto taleMemberDto = null;

        for (int i = 0; i < 4; i++) {
            // AI 서버에 이미지를 보내기 위해 promptset과 original image url을 담은 dto를 생성
            taleMemberDto = taleService.getTaleMemberDtoFromRedis(roomId, i);
            taleMemberDto.setImg("processing");
            taleService.setTaleMemberDtoToRedis(taleMemberDto);

            // ByteArrayResource 생성 (이미 메모리에 있는 파일 바이트 사용)
            int finalI = i;
            ByteArrayResource fileResource = getByteArrayResource(s3Service.getFileAsBytes(taleMemberDto.getOrginImg()), "origin_" + roomId + "_" + finalI + ".png");

            // MultiValueMap 생성
            PromptSet promptSet = taleMemberDto.getPromptSet();
            MultiValueMap<String, Object> parts = new LinkedMultiValueMap<>();
            parts.add("roomId", roomId);
            parts.add("order", i);
            parts.add("image", fileResource);
            parts.add("prompt", promptSet.getPrompt());
            parts.add("negativePrompt", promptSet.getNegativePrompt());

            webClient.post()
                    .uri("/gen/upgrade-handpicture")
                    .contentType(MediaType.MULTIPART_FORM_DATA)
                    .body(BodyInserters.fromMultipartData(parts))
                    .retrieve()
                    .bodyToMono(void.class)
                    .subscribe(unused -> System.out.println("요청 성공"),
                            error -> System.err.println("요청 실패: " + error.getMessage()));
        }
    }

    public void rerequestAIPicture(Long taleMemberId){
        if(taleMemberId == null)
            throw new BadRequestException("잘못된 요청입니다.");

        // ByteArrayResource 생성
        TaleMember taleMember = taleService.getTaleMember(taleMemberId);
        Long taleId = taleMember.getTale().getId();
        int order = taleMember.getOrderNum();
        if(taleMember == null)
            throw new BadRequestException("해당하는 동화 멤버가 없습니다.");

        if(taleMember.getOrginImg() == null)
            throw new BadRequestException("원본 이미지가 없습니다.");

        if(taleMember.getPrompt() == null || taleMember.getNegativePrompt() == null)
            throw new BadRequestException("프롬프트가 없습니다.");

        if(taleMember.getImg().equals("processing"))
            throw new BadRequestException("이미 처리중인 이미지입니다.");

        byte[] fileBytes = s3Service.getFileAsBytes(taleMember.getOrginImg());
        ByteArrayResource fileResource = getByteArrayResource(fileBytes, "origin_" + taleId + "_" + order + ".png");

        // promptSet 불러오기
        String prompt = taleMember.getPrompt();
        String negativePrompt = taleMember.getNegativePrompt();

        // request 보내기
        MultiValueMap<String, Object> parts = new LinkedMultiValueMap<>();
        parts.add("roomId", taleId);
        parts.add("order", order);
        parts.add("image", fileResource);
        parts.add("prompt", prompt);
        parts.add("negativePrompt", negativePrompt);
        System.out.println("parts = " + parts);

        webClient.post()
                .uri("/gen/picture")
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .body(BodyInserters.fromMultipartData(parts))
                .retrieve()
                .bodyToMono(void.class)
                .subscribe(unused -> System.out.println("요청 성공"),
                        error -> System.err.println("요청 실패: " + error.getMessage()));

    }

    private int getAudioDurationSecond(AudioFileFormat audioFileFormat) {
        AudioFormat format = audioFileFormat.getFormat();
        long frameLength = audioFileFormat.getFrameLength();
        float frameRate = format.getFrameRate();

        // frameRate가 0일 경우 0분을 반환하도록 처리
        if (frameRate <= 0) {
            return 0;
        }

        // 재생 시간을 초 단위로 계산한 후 int로 캐스팅 (소수점은 버림)
        return (int)(frameLength / frameRate);
    }

    public ApiResponse<TextResponseDto> requestVoiceKeyword(KeywordFileRequestDto keywordFileRequestDto){
        MultipartFile multipartFile = keywordFileRequestDto.getKeyword();
        try {
            InputStream originalStream = multipartFile.getInputStream();
            BufferedInputStream bufferedStream = new BufferedInputStream(originalStream);
            AudioFileFormat format = AudioSystem.getAudioFileFormat(bufferedStream);
            if(getAudioDurationSecond(format) >= 10*60)
                throw new BadRequestException("10분 이상의 파일은 지원하지 않습니다.");
            else if(format.getByteLength() >= 26214400)
                throw new BadRequestException("25MB 이상의 파일은 지원하지 않습니다.");

            // ByteArrayResource 생성
            ByteArrayResource fileResource = getByteArrayResource(keywordFileRequestDto.getKeyword());

            // MultiValueMap 생성
            MultiValueMap<String, Object> parts = new LinkedMultiValueMap<>();
            parts.add("file", fileResource);

            ApiResponse<TextResponseDto> response =  webClient.post()
                    .uri("/ask/voice-to-word")
                    .contentType(MediaType.MULTIPART_FORM_DATA)
                    .body(BodyInserters.fromMultipartData(parts))
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<ApiResponse<TextResponseDto>>(){})
                    .block();
            if(!response.getStatus().equals(ResponseCode.SUCCESS))
                throw new RuntimeException("AI 서버 요청 실패");
            return response;
        }catch(IOException | UnsupportedAudioFileException e){
            throw new BadRequestException("지원하는 형식(.wav)가 아니거나, 잘못된 파일입니다.");
        }
    }

    public ApiResponse<TextResponseDto> requestHandWriteKeyword(KeywordFileRequestDto keywordFileRequestDto) {
        // ByteArrayResource 생성
        ByteArrayResource fileResource = getByteArrayResource(keywordFileRequestDto.getKeyword());

        // MultiValueMap 생성
        MultiValueMap<String, Object> parts = new LinkedMultiValueMap<>();
        parts.add("file", fileResource);

        return webClient.post()
                .uri("/ask/handwrite-to-word")
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .body(BodyInserters.fromMultipartData(parts))
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<ApiResponse<TextResponseDto>>(){})
                .block();
    }

    private void handleGenerateTaleResponse(long roomId,GenerateTaleRequestDto generateTaleRequestDto, ApiResponse<GenerateTaleResponseDto> response){
        // 완성된 동화를 redis에 저장
        List<PageInfo> pages = response.getData().getPages();
        System.out.println("pages = " + pages);
        List<SentenceOwnerPair> sentenceOwnerPairList =  taleService.saveTaleText(roomId, pages);
        // websocket으로 알림
        webSocketNotiService.sendNotification("/topic/tale/" + roomId, sentenceOwnerPairList);
        // 프롬프트 생성 requestDiffusionPrompt-> taleService.saveTalePrompt(roomId, prompt);
        DiffusionPromptRequestDto diffusionPromptRequestDto = new DiffusionPromptRequestDto(generateTaleRequestDto.getTitle(), pages);
        requestDiffusionPrompt(roomId, diffusionPromptRequestDto);

        // 음성 생성 requestVoiceScript->  s3에 저장 -> taleService.saveTaleVoice(roomId, voiceUrl);
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
        TextRequestDto textRequestDto = new TextRequestDto(pages.getFullText());

        webClient.post()
                .uri("/gen/script-read")
                .header(HttpHeaders.CONTENT_TYPE, "application/json")
                .bodyValue(textRequestDto)
                .retrieve()
                .bodyToMono(DataBuffer.class)  // 바이너리 데이터로 받기
                .flatMap(dataBuffer -> convertToMultipartFile(dataBuffer, "voice_" + roomId + "_" + order + ".wav","audio/wav"))  // MultipartFile로 변환
                .subscribe(file -> taleService.saveTaleVoice(roomId, order, file)); // 저장된 파일 전달
    }

    public String requestVoiceScript(String script){
        TextRequestDto textRequestDto = new TextRequestDto(script);

        MultipartFile scriptReadFile = webClient.post()
                .uri("/gen/script-read")
                .header(HttpHeaders.CONTENT_TYPE, "application/json")
                .bodyValue(textRequestDto)
                .retrieve()
                .bodyToMono(DataBuffer.class)  // 바이너리 데이터로 받기
                .flatMap(dataBuffer -> convertToMultipartFile(dataBuffer, "voice.wav","audio/wav"))  // MultipartFile로 변환
                .block(); // 저장된 파일 전달

        return s3Service.uploadFile(scriptReadFile);
    }

    public ApiResponse<TaleSentencesResponseDto> requestTaleSentences(String title){
        return webClient.post()
                .uri("/gen/tale-sentences")
                .bodyValue(new TextRequestDto(title))
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<ApiResponse<TaleSentencesResponseDto>>(){})
                .block();
    }

    public void requestTaleImage(TaleTitleImageRequestDto taleTitleImageRequestDto){
        webClient.post()
                .uri("/gen/tale-image")
                .bodyValue(taleTitleImageRequestDto)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<ApiResponse<String>>(){})
                .block();
    }

    public void requestTaleIntroImage(TaleIntroImageRequestDto taleIntroImageRequestDto){
        webClient.post()
                .uri("/gen/tale-intro-image")
                .bodyValue(taleIntroImageRequestDto)
                .retrieve()
                .bodyToMono(void.class)
                .block();
    }

    private Mono<MultipartFile> convertToMultipartFile(DataBuffer dataBuffer, String fileName, String contentType) {
        return Mono.just(CustomMultipartFile.convertToMultipartFile(dataBuffer, fileName, contentType));
    }

    private ByteArrayResource getByteArrayResource(MultipartFile file) {
        try {
            byte[] fileBytes = file.getBytes();
            return getByteArrayResource(fileBytes, file.getOriginalFilename());
        } catch (IOException e) {
            System.err.println("파일 변환 중 오류 발생: " + e.getMessage());
            return null;
        }
    }

    private ByteArrayResource getByteArrayResource(byte[] file, String fileName) {
        return new ByteArrayResource(file) {
            @Override
            public String getFilename() {
                return fileName;
            }
        };
    }
}
