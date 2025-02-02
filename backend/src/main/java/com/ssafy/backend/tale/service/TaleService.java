package com.ssafy.backend.tale.service;

import com.ssafy.backend.common.S3Service;
import com.ssafy.backend.db.entity.BaseTale;
import com.ssafy.backend.db.entity.Member;
import com.ssafy.backend.db.entity.TaleMember;
import com.ssafy.backend.db.repository.MemberRepository;
import com.ssafy.backend.db.repository.TaleMemberRepository;
import com.ssafy.backend.db.repository.TaleRepository;
import com.ssafy.backend.tale.dto.common.Room;
import com.ssafy.backend.tale.dto.common.TaleMemberDto;
import com.ssafy.backend.tale.dto.request.GenerateTaleRequestDto;
import com.ssafy.backend.tale.dto.request.KeywordRequestDto;
import com.ssafy.backend.tale.dto.common.PromptSet;
import com.ssafy.backend.tale.dto.request.SubmitFileRequestDto;
import com.ssafy.backend.tale.dto.common.SentenceOwnerPair;
import com.ssafy.backend.tale.dto.common.PageInfo;
import com.ssafy.backend.tale.dto.response.StartTaleMakingResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

/**
 *  author : HEO-hyunjun
 *  date : 2025.01.31
 *  description : 동화 제작 관련 서비스,
 *  update
 *      1. startMakingTale, keywordSubmit 메소드 완성 (2025.02.01)
 *      2. redis에 tale_member 저장, 불러오기 메소드 추가 (2025.02.02)
 *      3. save~ 메소드 추가 (2025.02.02)
 *      4. todo: save TaleMemberDto to mysql (2025.02.02) -> mysql 테이블 수정 필요
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
    private final S3Service s3Service;
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
        List<SentenceOwnerPair> sentenceOwnerPairList = new ArrayList<>();

        //키워드 리스트를 생성합니다.
        List<String> keywordList = new ArrayList<>();
        keywordList.add(tale.getKeyword1());
        keywordList.add(tale.getKeyword2());
        keywordList.add(tale.getKeyword3());
        keywordList.add(tale.getKeyword4());

        int order = -1;
        int memberCnt = 0;
        while((order = getNextKeywordIdx(keywordCheck)) != -1){
            SentenceOwnerPair sentenceOwnerPair = new SentenceOwnerPair();
            sentenceOwnerPair.setOrder(order);
            sentenceOwnerPair.setOwner(participants.get(memberCnt).getId());
            sentenceOwnerPair.setSentence(keywordList.get(order));
            sentenceOwnerPairList.add(sentenceOwnerPair);
            memberCnt = (memberCnt+1) % participants.size();
        }

        startTaleMakingResponseDto.setSentenceOwnerPairs(sentenceOwnerPairList);

        ////////////////////////tale_member 관련작업//////////////////////////
        // 1. 빈 tale_member 4개 생성
        List<TaleMember> taleMembers = new ArrayList<>();
        for(int i = 0; i < 4; i++){
            // 각 멤버들을 설정합니다.
            TaleMember taleMember = new TaleMember();
            Member member = memberRepository.getReferenceById(sentenceOwnerPairList.get(i).getOwner());

            taleMember.setTale(taleRepository.getReferenceById(room.getRoomId()));

            // 키워드와 member를 매칭
            taleMember.setHas_host(Objects.equals(room.getMemberId(), member.getId()));
            int keywordOrder = sentenceOwnerPairList.get(i).getOrder();
            taleMember.setKeyword(keywordList.get(keywordOrder));
            taleMember.setOrderNum(keywordOrder);
            taleMember.setMember(member);

            taleMembers.add(taleMember);
        }

        // 2. tale_member 저장
        taleMemberRepository.saveAll(taleMembers);
        taleMembers = taleMemberRepository.findByTaleId(room.getRoomId());
        // 3. tale_member dto로 변환
        List<TaleMemberDto> taleMemberDtos = new ArrayList<>();
        for(int i = 0; i < 4; i++){
            TaleMemberDto taleMemberDto = TaleMemberDto.parse(taleMembers.get(i));
            taleMemberDto.setKeyword(null); // 단어를 선택하지 않음으로 초기화합니다. (mysql에는 저장되어있지만 redis에는 저장되어있지 않습니다.)
            taleMemberDtos.add(taleMemberDto);
        }

        // 3. tale_member redis에 저장
        for(int i = 0; i < 4; i++) {
            //System.out.println("taleMemberDtos.get(i) = " + taleMemberDtos.get(i));
            setTaleMemberDtoToRedis(taleMemberDtos.get(i));
        }
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
        Room room = getRoomFromRedis(keywordRequestDto.getRoomId());
        // 레디스에서 참가자 정보를 불러옵니다.
        Map<Long, Member> participants = room.getParticipants();

        // 참가자의 키워드를 저장합니다.
        Member member = participants.get(keywordRequestDto.getMemberId());
        if(member == null)
            throw new RuntimeException("유효하지 않은 참가자입니다.");

        TaleMember taleMember = taleMemberRepository.findByTaleIdAndOrderNum(room.getRoomId(), keywordRequestDto.getOrder());
        if(taleMember == null)
            throw new RuntimeException("유효하지 않은 참가자입니다.");

        TaleMemberDto taleMemberDto = TaleMemberDto.parse(taleMember);

        taleMemberDto.setKeyword(keywordRequestDto.getKeyword());
        setTaleMemberDtoToRedis(taleMemberDto);

        // 2. 단어 몇명 선택했는지 확인
        int cnt = 0;
        List<TaleMember> taleMembers = taleMemberRepository.findByTaleId(room.getRoomId());
        for (int i = 0; i < taleMembers.size(); i++) {
            TaleMemberDto participant = getTaleMemberDtoFromRedis(taleMembers.get(i));
            if(participant.getKeyword() != null)
                cnt++;
        }
        return cnt;
    }

    // 키워드 문장을 반환합니다.
    public GenerateTaleRequestDto getGenerateTaleInfo(long roomId){
        // 레디스에서 방 정보를 불러옵니다.
        Room room = getRoomFromRedis(roomId);

        // 동화 정보를 가져옵니다.
        BaseTale tale = baseTaleService.getById(room.getBaseTaleId());

        // 참가자의 키워드를 가져옵니다.
        List<String> keywordList = new ArrayList<>();
        for (int i = 0; i < 4; i++) {
            TaleMember taleMember = taleMemberRepository.findByTaleIdAndOrderNum(roomId, i);
            TaleMemberDto taleMemberDto = getTaleMemberDtoFromRedis(taleMember);
            String keyword = taleMemberDto.getKeyword();
            if(keyword == null) // 키워드가 null 인경우, baseTale의 키워드를 사용합니다.
                keyword = taleMember.getKeyword();
            keywordList.add(keyword);
        }

        // 키워드 문장을 반환합니다.
        GenerateTaleRequestDto generateTaleRequestDto = new GenerateTaleRequestDto();
        generateTaleRequestDto.setTitle(tale.getTitle());
        generateTaleRequestDto.setIntroduction(tale.getStartScript());
        generateTaleRequestDto.setSentences(keywordList);

        return generateTaleRequestDto;
    }

    // 전체 동화 내용을 저장하고, 각 참가자별 그림 그릴 문장을 반환합니다.
    public List<SentenceOwnerPair> saveTaleText(long roomId, List<PageInfo> pages){
        List<TaleMember> taleMembers = taleMemberRepository.findByTaleId(roomId);
        List<SentenceOwnerPair> sentenceOwnerPairs = new ArrayList<>();
        for(int i = 0; i < 4; i++){
            TaleMemberDto taleMemberDto = getTaleMemberDtoFromRedis(taleMembers.get(i));
            SentenceOwnerPair sentenceOwnerPair = new SentenceOwnerPair();

            int order = taleMemberDto.getOrderNum();

            taleMemberDto.setScript(pages.get(order).getFullText());
            taleMemberDto.setImgScript(pages.get(order).getExtractedSentence());
            // taleMember를 다시 저장합니다.
            setTaleMemberDtoToRedis(taleMemberDto);

            sentenceOwnerPair.setOrder(order);
            sentenceOwnerPair.setOwner(taleMemberDto.getMemberId());
            sentenceOwnerPair.setSentence(pages.get(order).getExtractedSentence());
            sentenceOwnerPairs.add(sentenceOwnerPair);
        }

        return sentenceOwnerPairs;
    }

    // 동화의 내용을 읽는 음성을 저장합니다.
    public void saveTaleVoice(long roomId, int order, MultipartFile voiceFile){
            //각 순서별로 taleMember를 불러옵니다.
            TaleMemberDto taleMemberDto = getTaleMemberDtoFromRedis(roomId, order);

            //음성을 s3에 업로드하고, url을 저장합니다.
            String voiceUrl = s3Service.uploadFile(voiceFile);
            taleMemberDto.setVoice(voiceUrl);

            // taleMember를 redis에 업데이트합니다.
            setTaleMemberDtoToRedis(taleMemberDto);
    }

    // 동화 삽화 수정용 프롬프트를 저장합니다.
    public void saveTalePrompt(long roomId, List<PromptSet> promptSetList){
        for(int i = 0; i < 4; i++){
            //각 순서별로 taleMember를 불러옵니다.
            TaleMemberDto taleMemberDto = getTaleMemberDtoFromRedis(roomId, i);

            //프롬프트를 저장합니다.
            taleMemberDto.setPromptSet(promptSetList.get(i));

            // taleMember를 redis에 업데이트합니다.
            setTaleMemberDtoToRedis(taleMemberDto);
        }
    }

    // 동화 손그림을 저장합니다.
    public int saveHandPicture(SubmitFileRequestDto submitFileRequestDto){
        // 레디스에서 tale_member를 불러옵니다.
        TaleMemberDto taleMemberDto = getTaleMemberDtoFromRedis(submitFileRequestDto.getRoomId(), submitFileRequestDto.getOrder());

        // 손그림을 s3에 업로드하고, url을 저장합니다.
        String imgUrl = s3Service.uploadFile(submitFileRequestDto.getFile());
        taleMemberDto.setOrginImg(imgUrl);

        // taleMember를 redis에 업데이트합니다.
        setTaleMemberDtoToRedis(taleMemberDto);

        // 4명이 모두 그림을 제출했는지 확인
        List<TaleMember> taleMembers = taleMemberRepository.findByTaleId(submitFileRequestDto.getRoomId());
        int cnt = 0;
        for (int i = 0; i < 4; i++) {
            TaleMemberDto participant = getTaleMemberDtoFromRedis(taleMembers.get(i));
            if(participant.getOrginImg() != null)
                cnt++;
        }
        return cnt;
    }

    public TaleMemberDto getTaleMemberDtoFromRedis(long roomId, int order){
        // 레디스에서 tale_member를 불러옵니다.
        TaleMember taleMember = taleMemberRepository.findByTaleIdAndOrderNum(roomId, order);
        return getTaleMemberDtoFromRedis(taleMember);
    }

    // 동화 AI 그림을 저장합니다.
    public void saveAIPicture(long roomId, int order, MultipartFile imageFile){
        // 레디스에서 tale_member를 불러옵니다.
        TaleMember taleMember = taleMemberRepository.findByTaleIdAndOrderNum(roomId, order);
        TaleMemberDto taleMemberDto = getTaleMemberDtoFromRedis(taleMember);

        // AI그림을 s3에 업로드하고, url을 저장합니다.
        String imgUrl = s3Service.uploadFile(imageFile);
        taleMemberDto.setImg(imgUrl);

        // taleMember를 redis에 업데이트합니다.
        setTaleMemberDtoToRedis(taleMemberDto);
    }

    private Room getRoomFromRedis(long roomId) {
        // 레디스에서 방 정보를 불러옵니다.
        ValueOperations<String, Object> ops = redisTemplate.opsForValue();
        Room room = (Room)ops.get("tale-" + roomId);
        if(room == null)
            throw new RuntimeException("유효하지 않은 방입니다.");
        return room;
    }
    
    // redis에서 tale_member 불러오기
    private TaleMemberDto getTaleMemberDtoFromRedis(TaleMember taleMember){
        ValueOperations<String, Object> ops = redisTemplate.opsForValue();
        TaleMemberDto taleMemberDto = (TaleMemberDto) ops.get("tale_member-"+taleMember.getId());
        if(taleMemberDto == null)
            throw new RuntimeException("유효하지 않은 방입니다..");
        return taleMemberDto;
    }
    
    // redis에 tale_member 저장
    private void setTaleMemberDtoToRedis(TaleMemberDto taleMemberDto){
        ValueOperations<String, Object> ops = redisTemplate.opsForValue();
        ops.set("tale_member-"+taleMemberDto.getId(), taleMemberDto);
        System.out.println("UPDATE!!!!!!!!!!!!!!!! taleMemberDto\n" + taleMemberDto);
    }
}
