package com.ssafy.backend.tale.service;

import com.ssafy.backend.db.entity.BaseTale;
import com.ssafy.backend.db.entity.Member;
import com.ssafy.backend.tale.dto.Room;
import com.ssafy.backend.tale.dto.response.KeywordSentence;
import com.ssafy.backend.tale.dto.response.StartTaleMakingResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Random;

/**
 *  author : HEO-hyunjun
 *  date : 2025.01.31
 *  description : 동화 제작 관련 서비스,
 *  update
 *      1.
 * */

@Service
@RequiredArgsConstructor
public class TaleService {
    private final BaseTaleService baseTaleService;
    private final RoomService roomService;

    // 동화 제작 시작
    // -> 방의정보를 보고 동화의 정보를 불러와서 키워드 문장을 매칭시킵니다.
    public StartTaleMakingResponseDto startMakingTale(long roomId) {
        //방의 정보를 불러옵니다.
        Room nowRoom = new Room();
        nowRoom.setRoomId(roomId);
        nowRoom = roomService.getRoom(nowRoom);

        //방의 동화 정보를 불러옵니다.
        BaseTale nowTale = baseTaleService.getById(nowRoom.getBaseTaleId());
        boolean[] keywordCheck = new boolean[4]; // 중복 선택을 방지하기 위한 방문배열


        //반환할 객체를 생성합니다.
        StartTaleMakingResponseDto startTaleMakingResponseDto = new StartTaleMakingResponseDto();

        //고정적인 정보에 대해 작성합니다.
        startTaleMakingResponseDto.setTaleTitle(nowTale.getTitle());
        startTaleMakingResponseDto.setTaleStartScript(nowTale.getStartScript());
        startTaleMakingResponseDto.setTaleStartScriptVoice(nowTale.getStartVoice());
        startTaleMakingResponseDto.setTaleStartImage(nowTale.getStartImg());

        //참가자과 키워드 문장을 매칭합니다.
        Map<Long, Member> allParticipants = nowRoom.getParticipants();
        List<KeywordSentence> keywordSentenceList = new ArrayList<>();

        //키워드 리스트를 생성합니다.
        List<String> keywordList = new ArrayList<>();
        keywordList.add(nowTale.getKeyword1());
        keywordList.add(nowTale.getKeyword2());
        keywordList.add(nowTale.getKeyword3());
        keywordList.add(nowTale.getKeyword4());

        for (Member member : allParticipants.values()) {
            KeywordSentence keywordSentence = new KeywordSentence();
            keywordSentence.setOwner(member.getId());
            //키워드 문장을 랜덤하게 선택합니다.
            keywordSentence.setSentence(keywordList.get(getNextKeywordIdx(keywordCheck)));
            keywordSentenceList.add(keywordSentence);
        }
        startTaleMakingResponseDto.setKeywordSentences(keywordSentenceList);

        return startTaleMakingResponseDto;
    }

    //중복이 되지 않도록 키워드문장 인덱스를 반환합니다.
    private int getNextKeywordIdx(boolean[] keywordCheck) {
        int ret = -1;
        int tmp = -1;
        while(true){
            tmp = new Random().nextInt(0,4); // 무작위한 번호를 선택
            if(!keywordCheck[tmp]){ // 이미 선택된 번호인지 확인
                ret = tmp;
                keywordCheck[tmp] = true;
                break;
            }
        }
        return ret;
    }

}
