package com.ssafy.backend.tale.service;

import com.ssafy.backend.db.entity.BaseTale;
import com.ssafy.backend.db.repository.BaseTaleRepository;
import com.ssafy.backend.tale.dto.common.BaseTaleDto;
import com.ssafy.backend.tale.dto.common.ParentBaseTaleDto;
import com.ssafy.backend.tale.dto.response.BaseTaleResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * author : heo hyunjun
 * date : 2025.01.31
 * description : Text 전송을 위한 응답 DTO
 */

@Service
@RequiredArgsConstructor
public class BaseTaleService {

    private final BaseTaleRepository baseTaleRepository;

    public List<BaseTale> getList(){
        return baseTaleRepository.findAll();
    }

    public BaseTale getById(long id){
        return baseTaleRepository.findById(id).get();
    }

    public BaseTale save(BaseTale baseTale){
        return baseTaleRepository.save(baseTale);
    }


    public BaseTaleDto parse(BaseTale baseTale){
        BaseTaleDto baseTaleDto = new BaseTaleDto();
        baseTaleDto.setId(baseTale.getId());
        baseTaleDto.setTitle(baseTale.getTitle());
        baseTaleDto.setTitleImg(baseTale.getTitleImg());
        baseTaleDto.setStartVoice(baseTale.getStartVoice());
        baseTaleDto.setStartImg(baseTale.getStartImg());
        baseTaleDto.setStartScript(baseTale.getStartScript());
        baseTaleDto.setKeyword1(baseTale.getKeyword1());
        baseTaleDto.setKeyword2(baseTale.getKeyword2());
        baseTaleDto.setKeyword3(baseTale.getKeyword3());
        baseTaleDto.setKeyword4(baseTale.getKeyword4());
        baseTaleDto.setKeywordSentence1(baseTale.getKeywordSentence1());
        baseTaleDto.setKeywordSentence2(baseTale.getKeywordSentence2());
        baseTaleDto.setKeywordSentence3(baseTale.getKeywordSentence3());
        baseTaleDto.setKeywordSentence4(baseTale.getKeywordSentence4());
        return baseTaleDto;
    }

    public BaseTale parse(BaseTaleDto baseTaleDto) {
        BaseTale baseTale = new BaseTale();
        baseTale.setId(baseTaleDto.getId());
        baseTale.setTitle(baseTaleDto.getTitle());
        baseTale.setTitleImg(baseTaleDto.getTitleImg());
        baseTale.setStartVoice(baseTaleDto.getStartVoice());
        baseTale.setStartImg(baseTaleDto.getStartImg());
        baseTale.setStartScript(baseTaleDto.getStartScript());
        baseTale.setKeyword1(baseTaleDto.getKeyword1());
        baseTale.setKeyword2(baseTaleDto.getKeyword2());
        baseTale.setKeyword3(baseTaleDto.getKeyword3());
        baseTale.setKeyword4(baseTaleDto.getKeyword4());
        baseTale.setKeywordSentence1(baseTaleDto.getKeywordSentence1());
        baseTale.setKeywordSentence2(baseTaleDto.getKeywordSentence2());
        baseTale.setKeywordSentence3(baseTaleDto.getKeywordSentence3());
        baseTale.setKeywordSentence4(baseTaleDto.getKeywordSentence4());

        if(!(baseTale.getKeywordSentence1().contains("xx") ||
                baseTale.getKeywordSentence2().contains("xx") ||
                baseTale.getKeywordSentence3().contains("xx") ||
                baseTale.getKeywordSentence4().contains("xx"))){
            throw new IllegalArgumentException("키워드 문장에 xx를 포함해야 합니다.");
        }

        return baseTale;
    }

    public BaseTale parse(ParentBaseTaleDto parentBaseTaleDto){
        BaseTale baseTale = new BaseTale();
        baseTale.setTitle(parentBaseTaleDto.getTitle());
        baseTale.setTitleImg(parentBaseTaleDto.getTitleImg());
        baseTale.setStartVoice(parentBaseTaleDto.getStartVoice());
        baseTale.setStartImg(parentBaseTaleDto.getStartImg());
        baseTale.setStartScript(parentBaseTaleDto.getStartScript());
        baseTale.setKeyword1(parentBaseTaleDto.getKeyword1());
        baseTale.setKeyword2(parentBaseTaleDto.getKeyword2());
        baseTale.setKeyword3(parentBaseTaleDto.getKeyword3());
        baseTale.setKeyword4(parentBaseTaleDto.getKeyword4());
        baseTale.setKeywordSentence1(parentBaseTaleDto.getKeywordSentence1());
        baseTale.setKeywordSentence2(parentBaseTaleDto.getKeywordSentence2());
        baseTale.setKeywordSentence3(parentBaseTaleDto.getKeywordSentence3());
        baseTale.setKeywordSentence4(parentBaseTaleDto.getKeywordSentence4());
        return baseTale;
    }

    public List<BaseTaleResponseDto> getBaseTaleList(){
        List<BaseTale> baseTales = baseTaleRepository.findAll();
        List<BaseTaleResponseDto> baseTaleResponseDtos = new ArrayList<>();
        for(BaseTale baseTale : baseTales){
            BaseTaleResponseDto baseTaleResponseDto = new BaseTaleResponseDto();
            baseTaleResponseDto.setId(baseTale.getId());
            baseTaleResponseDto.setTitle(baseTale.getTitle());
            baseTaleResponseDto.setTitleImg(baseTale.getTitleImg());
            baseTaleResponseDtos.add(baseTaleResponseDto);
        }
        return baseTaleResponseDtos;
    }
}
