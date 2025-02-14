package com.ssafy.backend.tale.service;

import com.ssafy.backend.db.entity.ParentBaseTale;
import com.ssafy.backend.db.repository.ParentBaseTaleRepository;
import com.ssafy.backend.tale.dto.common.ParentBaseTaleDto;
import com.ssafy.backend.tale.dto.response.ParentBaseTaleResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ParentBaseTaleService {
    ParentBaseTaleRepository parentBaseTaleRepository;

    public List<ParentBaseTaleResponseDto> getList(){
        List<ParentBaseTaleResponseDto> parentBaseTaleResponseDtoList = new ArrayList<>();
        List<ParentBaseTale> parentBaseTaleList = parentBaseTaleRepository.findAll();

        for(ParentBaseTale parentBaseTale : parentBaseTaleList){
            parentBaseTaleResponseDtoList.add(parseResponse(parentBaseTale));
        }
        return parentBaseTaleResponseDtoList;
    }
    public List<ParentBaseTaleResponseDto> getList(Long memberId){
        List<ParentBaseTaleResponseDto> parentBaseTaleResponseDtoList = new ArrayList<>();
        List<ParentBaseTale> parentBaseTaleList = parentBaseTaleRepository.findByMemberId(memberId);

        for(ParentBaseTale parentBaseTale : parentBaseTaleList){
            parentBaseTaleResponseDtoList.add(parseResponse(parentBaseTale));
        }
        return parentBaseTaleResponseDtoList;
    }

    public List<ParentBaseTaleResponseDto> getList(Long memberId, boolean hasApproved){
        List<ParentBaseTaleResponseDto> parentBaseTaleResponseDtoList = new ArrayList<>();
        List<ParentBaseTale> parentBaseTaleList = parentBaseTaleRepository.findByMemberIdAndHasApproved(memberId, hasApproved);

        for(ParentBaseTale parentBaseTale : parentBaseTaleList){
            parentBaseTaleResponseDtoList.add(parseResponse(parentBaseTale));
        }
        return parentBaseTaleResponseDtoList;
    }

    public List<ParentBaseTaleResponseDto> getList(boolean hasApproved){
        List<ParentBaseTaleResponseDto> parentBaseTaleResponseDtoList = new ArrayList<>();
        List<ParentBaseTale> parentBaseTaleList = parentBaseTaleRepository.findByHasApproved(hasApproved);

        for(ParentBaseTale parentBaseTale : parentBaseTaleList){
            parentBaseTaleResponseDtoList.add(parseResponse(parentBaseTale));
        }
        return parentBaseTaleResponseDtoList;
    }

    public ParentBaseTaleDto getById(Long id){
        ParentBaseTale parentBaseTale = parentBaseTaleRepository.getReferenceById(id);
        return parse(parentBaseTale);
    }

    public ParentBaseTale save(ParentBaseTaleDto parentBaseTaleDto){
        ParentBaseTale parentBaseTale = parse(parentBaseTaleDto);
        return parentBaseTaleRepository.save(parentBaseTale);
    }

    public ParentBaseTale parse(ParentBaseTaleDto parentBaseTaleDto){
        ParentBaseTale parentBaseTale = new ParentBaseTale();
        parentBaseTale.setId(parentBaseTaleDto.getId());
        parentBaseTale.setTitle(parentBaseTaleDto.getTitle());
        parentBaseTale.setTitleImg(parentBaseTaleDto.getTitleImg());
        parentBaseTale.setStartVoice(parentBaseTaleDto.getStartVoice());
        parentBaseTale.setStartImg(parentBaseTaleDto.getStartImg());
        parentBaseTale.setStartScript(parentBaseTaleDto.getStartScript());
        parentBaseTale.setKeyword1(parentBaseTaleDto.getKeyword1());
        parentBaseTale.setKeyword2(parentBaseTaleDto.getKeyword2());
        parentBaseTale.setKeyword3(parentBaseTaleDto.getKeyword3());
        parentBaseTale.setKeyword4(parentBaseTaleDto.getKeyword4());
        parentBaseTale.setKeywordSentence1(parentBaseTaleDto.getKeywordSentence1());
        parentBaseTale.setKeywordSentence2(parentBaseTaleDto.getKeywordSentence2());
        parentBaseTale.setKeywordSentence3(parentBaseTaleDto.getKeywordSentence3());
        parentBaseTale.setKeywordSentence4(parentBaseTaleDto.getKeywordSentence4());
        parentBaseTale.setMemberId(parentBaseTaleDto.getMemberId());
        parentBaseTale.setHasApproved(parentBaseTaleDto.getHasApproved());
        return parentBaseTale;
    }

    public ParentBaseTaleDto parse(ParentBaseTale parentBaseTale){
        ParentBaseTaleDto parentBaseTaleDto = new ParentBaseTaleDto();
        parentBaseTaleDto.setId(parentBaseTale.getId());
        parentBaseTaleDto.setTitle(parentBaseTale.getTitle());
        parentBaseTaleDto.setTitleImg(parentBaseTale.getTitleImg());
        parentBaseTaleDto.setStartVoice(parentBaseTale.getStartVoice());
        parentBaseTaleDto.setStartImg(parentBaseTale.getStartImg());
        parentBaseTaleDto.setStartScript(parentBaseTale.getStartScript());
        parentBaseTaleDto.setKeyword1(parentBaseTale.getKeyword1());
        parentBaseTaleDto.setKeyword2(parentBaseTale.getKeyword2());
        parentBaseTaleDto.setKeyword3(parentBaseTale.getKeyword3());
        parentBaseTaleDto.setKeyword4(parentBaseTale.getKeyword4());
        parentBaseTaleDto.setKeywordSentence1(parentBaseTale.getKeywordSentence1());
        parentBaseTaleDto.setKeywordSentence2(parentBaseTale.getKeywordSentence2());
        parentBaseTaleDto.setKeywordSentence3(parentBaseTale.getKeywordSentence3());
        parentBaseTaleDto.setKeywordSentence4(parentBaseTale.getKeywordSentence4());
        parentBaseTaleDto.setMemberId(parentBaseTale.getMemberId());
        parentBaseTaleDto.setHasApproved(parentBaseTale.getHasApproved());
        return parentBaseTaleDto;
    }

    public ParentBaseTaleResponseDto parseResponse(ParentBaseTale parentBaseTale){
        ParentBaseTaleResponseDto parentBaseTaleResponseDto = new ParentBaseTaleResponseDto();
        parentBaseTaleResponseDto.setId(parentBaseTale.getId());
        parentBaseTaleResponseDto.setTitle(parentBaseTale.getTitle());
        parentBaseTaleResponseDto.setTitleImg(parentBaseTale.getTitleImg());
        parentBaseTaleResponseDto.setHasApproved(parentBaseTale.getHasApproved());
        return parentBaseTaleResponseDto;
    }
}
