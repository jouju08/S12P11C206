package com.ssafy.backend.tale.service;

import com.ssafy.backend.db.entity.BaseTale;
import com.ssafy.backend.db.entity.Member;
import com.ssafy.backend.db.entity.TaleMember;
import com.ssafy.backend.db.repository.MemberRepository;
import com.ssafy.backend.db.repository.TaleMemberRepository;
import com.ssafy.backend.db.repository.TaleRepository;
import com.ssafy.backend.tale.dto.Room;
import com.ssafy.backend.tale.dto.request.KeywordRequestDto;
import com.ssafy.backend.tale.dto.response.KeywordSentence;
import com.ssafy.backend.tale.dto.response.StartTaleMakingResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
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
    private final TaleRepository taleRepository;
    private final BaseTaleService baseTaleService;
    private final RoomService roomService;
    private final RedisTemplate<String, Object> redisTemplate;
    private final MemberRepository memberRepository;
    private final TaleMemberRepository taleMemberRepository;

    // 동화 제작 시작
    // -> 방의정보를 보고 동화의 정보를 불러와서 키워드 문장을 매칭시킵니다.
    public StartTaleMakingResponseDto startMakingTale(long roomId) {
        /////////////////////////반환 데이터 관련///////////////////////////
        //방의 정보를 불러옵니다.
        Room room = new Room();
        room.setRoomId(roomId);
        room = roomService.getRoom(room);

        //방의 동화 정보를 불러옵니다.
        BaseTale tale = baseTaleService.getById(room.getBaseTaleId());
        boolean[] keywordCheck = new boolean[4]; // 중복 선택을 방지하기 위한 방문배열

        //반환할 객체를 생성합니다.
        StartTaleMakingResponseDto startTaleMakingResponseDto = new StartTaleMakingResponseDto();

        //고정적인 정보에 대해 작성합니다.
        startTaleMakingResponseDto.setTaleTitle(tale.getTitle());
        startTaleMakingResponseDto.setTaleStartScript(tale.getStartScript());
        startTaleMakingResponseDto.setTaleStartScriptVoice(tale.getStartVoice());
        startTaleMakingResponseDto.setTaleStartImage(tale.getStartImg());

        //참가자과 키워드 문장을 매칭합니다.
        List<Member> participants = new ArrayList<>(room.getParticipants().values());
        List<KeywordSentence> keywordSentenceList = new ArrayList<>();

        //키워드 리스트를 생성합니다.
        List<String> keywordList = new ArrayList<>();
        keywordList.add(tale.getKeyword1());
        keywordList.add(tale.getKeyword2());
        keywordList.add(tale.getKeyword3());
        keywordList.add(tale.getKeyword4());

        int order = -1;
        int memberCnt = 0;
        while((order = getNextKeywordIdx(keywordCheck)) != -1){
            KeywordSentence keywordSentence = new KeywordSentence();
            keywordSentence.setOrder(order);
            keywordSentence.setOwner(participants.get(memberCnt).getId());
            keywordSentence.setSentence(keywordList.get(order));
            keywordSentenceList.add(keywordSentence);
            memberCnt = (memberCnt+1) % participants.size();
        }

        startTaleMakingResponseDto.setKeywordSentences(keywordSentenceList);

        ////////////////////////tale_member 관련작업//////////////////////////
        // 1. 빈 tale_member 4개 생성
        List<TaleMember> taleMembers = new ArrayList<>();
        for(int i = 0; i < 4; i++){
            // 각 멤버들을 설정합니다.
            TaleMember taleMember = new TaleMember();
            taleMember.setTale(taleRepository.getReferenceById(room.getBaseTaleId()));
            // 키워드와 member를 매칭
            taleMember.setOrderNum(keywordSentenceList.get(i).getOrder());
            taleMember.setMember(memberRepository.getReferenceById(keywordSentenceList.get(i).getOwner()));

            taleMembers.add(taleMember);
        }
        // 2. tale_member 저장
        taleMemberRepository.saveAll(taleMembers);
        taleMembers = (List<TaleMember>) taleMemberRepository.getReferenceById(room.getBaseTaleId());

        // 3. tale_member redis에 저장
        ValueOperations<String, Object> ops = redisTemplate.opsForValue();
        for(int i = 0; i < 4; i++)
            ops.set("tale_member-"+taleMembers.get(i).getId().toString(), taleMembers.get(i));

        return startTaleMakingResponseDto;
    }

    // 중복이 되지 않도록 키워드문장 인덱스를 반환합니다.
    private int getNextKeywordIdx(boolean[] keywordCheck) {
        int ret = -1;
        int cnt = 0;
        for(int i = 0; i < 4; i++)
            if(keywordCheck[i])
                cnt++;
        if(cnt == 4)
            return ret;

        while(true){
            int tmp = new Random().nextInt(0,4); // 무작위한 번호를 선택
            if(!keywordCheck[tmp]){ // 이미 선택된 번호인지 확인
                ret = tmp;
                keywordCheck[tmp] = true;
                break;
            }
        }
        return ret;
    }

    // 키워드 최종선택한 인원 수를 반환합니다.
    // 1. 레디스에 키워드 저장
    // 2. 단어 몇명 선택했는지 확인
    public int keywordSubmit(KeywordRequestDto keywordRequestDto){
        // 1. 레디스에 키워드 저장
        // 레디스에서 방 정보를 불러옵니다.
        ValueOperations<String, Object> ops = redisTemplate.opsForValue();
        Room room = (Room)ops.get("tale-" + keywordRequestDto.getRoomId().toString());
        if(room == null)
            throw new RuntimeException("유효하지 않은 방입니다.");
        // 레디스에서 참가자 정보를 불러옵니다.
        Map<Long, Member> participants = room.getParticipants();

        // 참가자의 키워드를 저장합니다.
        Member member = participants.get(keywordRequestDto.getMemberId());
        if(member == null)
            throw new RuntimeException("유효하지 않은 참가자입니다.");

        TaleMember taleMember = taleMemberRepository.findByMemberIdAndTaleId(member.getId(), room.getRoomId());
        if(taleMember == null)
            throw new RuntimeException("유효하지 않은 참가자입니다.");

        taleMember.setKeyword(keywordRequestDto.getKeyword());
        ops.set("tale_member-"+taleMember.getId().toString(), taleMember);

        // 2. 단어 몇명 선택했는지 확인
        int cnt = 0;
        List<TaleMember> taleMembers = (List<TaleMember>)taleMemberRepository.getReferenceById(room.getRoomId());
        for (int i = 0; i < taleMembers.size(); i++) {
            TaleMember participant = (TaleMember) ops.get("tale_member-"+taleMembers.get(i).getId().toString());
            if(participant.getKeyword() != null)
                cnt++;
        }
        return cnt;
    }
}
