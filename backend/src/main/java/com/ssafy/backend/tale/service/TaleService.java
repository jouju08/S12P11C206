package com.ssafy.backend.tale.service;

import com.ssafy.backend.common.S3Service;
import com.ssafy.backend.common.WebSocketNotiService;
import com.ssafy.backend.db.entity.BaseTale;
import com.ssafy.backend.db.entity.Member;
import com.ssafy.backend.db.entity.Tale;
import com.ssafy.backend.db.entity.TaleMember;
import com.ssafy.backend.db.repository.MemberRepository;
import com.ssafy.backend.db.repository.TaleMemberRepository;
import com.ssafy.backend.db.repository.TaleRepository;
import com.ssafy.backend.tale.dto.common.*;
import com.ssafy.backend.tale.dto.request.GenerateTaleRequestDto;
import com.ssafy.backend.tale.dto.request.KeywordRequestDto;
import com.ssafy.backend.tale.dto.request.RoomInviteRequestDto;
import com.ssafy.backend.tale.dto.request.SubmitFileRequestDto;
import com.ssafy.backend.tale.dto.response.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
 *      4. save TaleMemberDto to mysql / getTaleMemberDtoFromRedis 메소드 추가 (2025.02.02)
 *      5. 동화 저장시점 확인 메소드 추가 (2025.02.11)
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
    private final WebSocketNotiService webSocketNotiService;

    private final int PAGE_SIZE = 10;

    //내가 참여한 동화 목록 불러오기
    public List<TaleResponseDto> getByUserId(Long memberId, String order, int page, Long baseTaleId) {
        if(memberId == null)
            throw new RuntimeException("유효하지 않은 사용자입니다.");

        Sort.Direction direction = order.equals("LATEST") ? Sort.Direction.DESC : Sort.Direction.ASC;

        Pageable pageable = PageRequest.of(page, PAGE_SIZE, Sort.by(direction, "createdAt"));

        // tale_member에서 member_id로 tale_id를 찾아서 tale_id로 tale을 찾아서 반환
        //반환할 객체를 생성합니다.
        List<TaleResponseDto> taleResponseDtoList = new ArrayList<>();

        // memberId로 taleMember를 찾습니다. (참여한 동화 페이지들을 찾습니다.)
        Page<TaleMember> taleMembers = null;
        if(baseTaleId == null)
            taleMembers = taleMemberRepository.findByMemberId(memberId, pageable);
        else
            taleMembers = taleMemberRepository.findByMemberIdAndBaseTaleId(memberId, baseTaleId, pageable);
        HashSet<Long> taleIdSet = new HashSet<>();
        //각 동화 페이지별로
        for (TaleMember taleMember : taleMembers) {
            Long taleId = taleMember.getTale().getId();
            if(taleIdSet.contains(taleId)) // 중복된 tale은 제외합니다.
                continue;

            taleIdSet.add(taleId);
            TaleResponseDto taleResponseDto = parseTale(taleMember.getTale()); // 동화 페이지를 파싱합니다.
            taleResponseDtoList.add(taleResponseDto); // 반환객체에 추가합니다.
        }

        return taleResponseDtoList;
    }

    // 동화 디테일을 불러옵니다.
    public TaleDetailResponseDto getByTaleId(long taleId) {
        Tale tale = taleRepository.getReferenceById(taleId);
        TaleDetailResponseDto taleDetailResponseDto = new TaleDetailResponseDto();
        taleDetailResponseDto.setTaleId(tale.getId());
        taleDetailResponseDto.setBaseTaleId(tale.getBaseTale().getId());

        // 참가자들을 파싱합니다.
        List<TaleMember> taleMembers = taleMemberRepository.findByTaleId(taleId);
        List<String> participants = new ArrayList<>();
        HashSet<Long> taleMemberIdSet = new HashSet<>();

        for (TaleMember taleMember : taleMembers) {
            if(taleMemberIdSet.contains(taleMember.getMember().getId().longValue())) // 중복된 taleMember는 제외합니다.
                continue;
            taleMemberIdSet.add(taleMember.getMember().getId().longValue());
            participants.add(taleMember.getMember().getNickname());
        }
        taleDetailResponseDto.setParticipants(participants);

        taleDetailResponseDto.setCreatedAt(tale.getCreatedAt());

        taleDetailResponseDto.setCoverImg(tale.getBaseTale().getTitleImg());
        taleDetailResponseDto.setTitle(tale.getBaseTale().getTitle());
        return taleDetailResponseDto;
    }

    private TaleResponseDto parseTale(Tale tale){
        TaleResponseDto taleResponseDto = new TaleResponseDto();
        BaseTale baseTale = tale.getBaseTale();
        taleResponseDto.setTaleId(tale.getId());
        taleResponseDto.setBaseTaleId(baseTale.getId());
        taleResponseDto.setImg(baseTale.getTitleImg());
        taleResponseDto.setTitle(baseTale.getTitle());
        taleResponseDto.setCreatedAt(tale.getCreatedAt());
        return taleResponseDto;
    }

    // 동화 제작 시작
    // -> 방의정보를 보고 동화의 정보를 불러와서 키워드 문장을 매칭시킵니다.
    public StartTaleMakingResponseDto startMakingTale(long roomId) {
        /////////////////////////반환 데이터 관련///////////////////////////
        //방의 정보를 불러옵니다.
        Room room = new Room();
        room.setRoomId(roomId);
        room = roomService.getRoom(room);

        //방의 동화 정보를 불러옵니다.
        BaseTale baseTale = baseTaleService.getById(room.getBaseTaleId());

        boolean[] keywordCheck = new boolean[4]; // 중복 선택을 방지하기 위한 방문배열

        //반환할 객체를 생성합니다.
        StartTaleMakingResponseDto startTaleMakingResponseDto = new StartTaleMakingResponseDto();

        //고정적인 정보에 대해 작성합니다.
        startTaleMakingResponseDto.setTaleTitle(baseTale.getTitle());
        startTaleMakingResponseDto.setTaleStartScript(baseTale.getStartScript());
        startTaleMakingResponseDto.setTaleStartScriptVoice(baseTale.getStartVoice());
        startTaleMakingResponseDto.setTaleStartImage(baseTale.getStartImg());

        //참가자과 키워드 문장을 매칭합니다.
        List<Member> participants = new ArrayList<>(room.getParticipants().values());
        List<SentenceOwnerPair> sentenceOwnerPairList = new ArrayList<>();

        //키워드 리스트를 생성합니다.
        List<String> keywordList = new ArrayList<>();
        keywordList.add(baseTale.getKeyword1());
        keywordList.add(baseTale.getKeyword2());
        keywordList.add(baseTale.getKeyword3());
        keywordList.add(baseTale.getKeyword4());

        List<String> keywordSentenceList = new ArrayList<>();
        keywordSentenceList.add(baseTale.getKeywordSentence1());
        keywordSentenceList.add(baseTale.getKeywordSentence2());
        keywordSentenceList.add(baseTale.getKeywordSentence3());
        keywordSentenceList.add(baseTale.getKeywordSentence4());

        int order = -1;
        int memberCnt = 0;
        while((order = getNextKeywordIdx(keywordCheck)) != -1){
            SentenceOwnerPair sentenceOwnerPair = new SentenceOwnerPair();
            sentenceOwnerPair.setOrder(order);
            sentenceOwnerPair.setOwner(participants.get(memberCnt).getId());
            sentenceOwnerPair.setSentence(keywordSentenceList.get(order));
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
            TaleMemberDto taleMemberDto = taleMember2taleMemberDto(taleMembers.get(i));
            taleMemberDto.setKeyword(null); // 단어를 선택하지 않음으로 초기화합니다. (mysql에는 저장되어있지만 redis에는 저장되어있지 않습니다.)
            taleMemberDtos.add(taleMemberDto);
        }

        // 3. tale_member redis에 저장
        for(int i = 0; i < 4; i++) {
            //System.out.println("taleMemberDtos.get(i) = " + taleMemberDtos.get(i));
            setTaleMemberDtoToRedis(taleMemberDtos.get(i));
        }

        // 4. 레디스에 대기 방 삭제.
        roomService.deleteRoom(roomId);
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

        TaleMemberDto taleMemberDto = taleMember2taleMemberDto(taleMember);

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
        List<String> keywordSentenceList = new ArrayList<>();
        keywordSentenceList.add(tale.getKeywordSentence1());
        keywordSentenceList.add(tale.getKeywordSentence2());
        keywordSentenceList.add(tale.getKeywordSentence3());
        keywordSentenceList.add(tale.getKeywordSentence4());

        // 참가자의 키워드를 가져옵니다.
        List<String> keywordList = new ArrayList<>();
        for (int i = 0; i < 4; i++) {
            TaleMember taleMember = taleMemberRepository.findByTaleIdAndOrderNum(roomId, i);
            TaleMemberDto taleMemberDto = getTaleMemberDtoFromRedis(taleMember);
            String keyword = taleMemberDto.getKeyword();
            if(keyword == null) // 키워드가 null 인경우, baseTale의 키워드를 사용합니다.
                keyword = taleMember.getKeyword();
            String keywordSentence = keywordSentenceList.get(i);
            keywordSentence = keywordSentence.replace("xx", keyword);

            keywordList.add(keywordSentence);
        }

        // 키워드 문장을 반환합니다.
        GenerateTaleRequestDto generateTaleRequestDto = new GenerateTaleRequestDto();
        generateTaleRequestDto.setTitle(tale.getTitle());
        generateTaleRequestDto.setIntroduction(tale.getStartScript());
        generateTaleRequestDto.setSentences(keywordList);

        return generateTaleRequestDto;
    }

    // mySQL에서 tale_page를 불러옵니다.
    public TalePageResponseDto getTalePage(long roomId, int order){
        TalePageResponseDto talePageResponseDto = null;

        if(order-- == 0){ //order가 0인경우 -> baseTale에서 불러와야함.
            BaseTale baseTale = getBaseTaleByRoomId(roomId);
            talePageResponseDto = parseTalePage(baseTale);
        }else { // 그 외에 경우 원래 order대로 받아오면됨
            TaleMember taleMember = taleMemberRepository.findByTaleIdAndOrderNum(roomId, order);
            if(taleMember == null)
                throw new RuntimeException("유효하지 않은 동화페이지입니다.");

            talePageResponseDto = parseTalePage(taleMember);
        }

        return talePageResponseDto;
    }

    // baseTale을 tale_page로 변환합니다.
    private TalePageResponseDto parseTalePage(BaseTale baseTale){
        TalePageResponseDto talePageResponseDto = new TalePageResponseDto();
        talePageResponseDto.setOrderNum(0); // baseTale이 0번째 페이지이므로 0을 설정합니다.
        talePageResponseDto.setMemberId(-1);
        talePageResponseDto.setTaleId(baseTale.getId());
        talePageResponseDto.setOriginImg(baseTale.getStartImg());
        talePageResponseDto.setImg(baseTale.getStartImg());
        talePageResponseDto.setVoice(baseTale.getStartVoice());
        talePageResponseDto.setScript(baseTale.getStartScript());
        return talePageResponseDto;
    }

    // tale_memberDto를 tale_page로 변환합니다.
    private TalePageResponseDto parseTalePage(TaleMember taleMember){
        TalePageResponseDto talePageResponseDto = new TalePageResponseDto();
        talePageResponseDto.setOrderNum(taleMember.getOrderNum()+1); // baseTale이 0번째 페이지이므로 +1을 해줍니다.
        talePageResponseDto.setMemberId(taleMember.getMember().getId());
        talePageResponseDto.setTaleId(taleMember.getTale().getId());
        talePageResponseDto.setOriginImg(taleMember.getOrginImg());
        talePageResponseDto.setImg(taleMember.getImg());
        talePageResponseDto.setVoice(taleMember.getVoice());
        talePageResponseDto.setScript(taleMember.getScript());
        return talePageResponseDto;
    }

    private BaseTale getBaseTaleByRoomId(long roomId){
        Tale tale = taleRepository.getReferenceById(roomId);
        return tale.getBaseTale();
    }

    // 전체 동화 내용을 저장하고, 각 참가자별 그림 그릴 문장을 반환합니다.
    public List<SentenceOwnerPair> saveTaleText(long roomId, List<PageInfo> pages){
        List<TaleMember> taleMembers = taleMemberRepository.findByTaleId(roomId);
        List<SentenceOwnerPair> sentenceOwnerPairs = new ArrayList<>();
        for(int i = 0; i < 4; i++){
            // redis에서 페이지 순서대로 tale_member를 불러옵니다.
            TaleMemberDto taleMemberDto = getTaleMemberDtoFromRedis(taleMembers.get(i));
            SentenceOwnerPair sentenceOwnerPair = new SentenceOwnerPair();

            int order = taleMemberDto.getOrderNum();

            // 페이지 내용과 그림 그릴 문장을 저장합니다.
            taleMemberDto.setScript(pages.get(order).getFullText());
            taleMemberDto.setImgScript(pages.get(order).getExtractedSentence());

            // taleMember를 다시 저장합니다.
            setTaleMemberDtoToRedis(taleMemberDto);

            // 반환할 객체에 저장합니다.
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

            verifyTaleMaking(roomId);
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

    public void deleteTaleFromRedis(long roomId){
        for(int i = 0; i < 4; i++){
            TaleMember taleMember = taleMemberRepository.findByTaleIdAndOrderNum(roomId, i);
            TaleMemberDto taleMemberDto = getTaleMemberDtoFromRedis(taleMember);
            redisTemplate.delete("tale_member-"+taleMemberDto.getId());
        }

        redisTemplate.delete("tale-"+roomId);
    }

    //redis의 tale_member를 mysql에 저장합니다.
    public void saveTaleFromRedis(long roomId) {
        List<TaleMember> taleMembers = taleMemberRepository.findByTaleId(roomId);
        for (int i = 0; i < 4; i++) {
            TaleMemberDto taleMemberDto = getTaleMemberDtoFromRedis(taleMembers.get(i));
            TaleMember taleMember = taleMemberDto2taleMember(taleMemberDto);

            taleMembers.set(i, taleMember);
        }
        taleMemberRepository.saveAll(taleMembers);
    }

    public TaleMemberDto getTaleMemberDtoFromRedis(long roomId, int order){
        // 레디스에서 tale_member를 불러옵니다.
        TaleMember taleMember = taleMemberRepository.findByTaleIdAndOrderNum(roomId, order);
        return getTaleMemberDtoFromRedis(taleMember);
    }

    // 동화 AI 그림을 저장합니다.
    //(수정) mysql에 저장돼있으므로 redis에서 불러오지 않습니다.
    public void saveAIPicture(SubmitFileRequestDto submitFileRequestDto){
        long roomId = submitFileRequestDto.getRoomId();
        int order = submitFileRequestDto.getOrder();
        MultipartFile imageFile = submitFileRequestDto.getFile();

        // mysql에서 tale_member를 불러옵니다.
        TaleMember taleMember = taleMemberRepository.findByTaleIdAndOrderNum(roomId, order);
        // 레디스에서 tale_member를 불러옵니다.
//        TaleMemberDto taleMemberDto = getTaleMemberDtoFromRedis(taleMember);

        // AI그림을 s3에 업로드하고, url을 저장합니다.
        String imgUrl = s3Service.uploadFile(imageFile);
        taleMember.setImg(imgUrl);

        // taleMember를 redis에 업데이트합니다.
//        setTaleMemberDtoToRedis(taleMemberDto);

        // mysql에 저장합니다.
        taleMemberRepository.save(taleMember);
    }

    // AI 그림이 완성된 페이지의 수를 반환합니다.
    public int getCompletedAIPictureCnt(long roomId){
        List<TaleMember> taleMembers = taleMemberRepository.findByTaleId(roomId);
        int cnt = 0;
        for (int i = 0; i < 4; i++) {
            TaleMember participant = taleMembers.get(i);
            if(participant.getImg() != null)
                cnt++;
        }

        return cnt;
    }

    public void verifyTaleMaking(long roomId){
        List<TaleMember> taleMembers = taleMemberRepository.findByTaleId(roomId);
        int voiceCnt = 0;
        int originImgCnt = 0;
        int promptCnt = 0;

        for (int i = 0; i < 4; i++) {
            TaleMemberDto taleMemberDto = getTaleMemberDtoFromRedis(taleMembers.get(i));
            if(taleMemberDto.getVoice() != null)
                voiceCnt++;
            if(taleMemberDto.getOrginImg() != null)
                originImgCnt++;
            if(taleMemberDto.getPromptSet() != null)
                promptCnt++;
        }
        System.out.println(roomId + "room이 완성 됐나 확인해보자~~~~~~~~~~~~~~~~~~" );
        System.out.println("promptCnt = " + promptCnt);
        System.out.println("originImgCnt = " + originImgCnt);
        System.out.println("voiceCnt = " + voiceCnt);
        if(voiceCnt == 4 && originImgCnt == 4 && promptCnt == 4){
            // mysql에 저장합니다.
            System.out.println(roomId+"room이 완성! mysql에 저장합니다.");
            saveTaleFromRedis(roomId);
            deleteTaleFromRedis(roomId);
            webSocketNotiService.sendNotification("/topic/tale/" + roomId + "/finish", "finish tale making");
        }
    }

    // 레디스에서 방 정보를 불러옵니다.
    private Room getRoomFromRedis(long roomId) {
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
        System.out.println("생성되고 있는 동화 정보 수정 (TaleService)\n" + taleMemberDto);
    }

    private TaleMemberDto taleMember2taleMemberDto(TaleMember taleMember) {
        TaleMemberDto taleMemberDto = new TaleMemberDto();
        taleMemberDto.setId(taleMember.getId());
        taleMemberDto.setHas_host(taleMember.getHas_host());
        taleMemberDto.setKeyword(taleMember.getKeyword());
        taleMemberDto.setOrderNum(taleMember.getOrderNum());
        taleMemberDto.setOrginImg(taleMember.getOrginImg());
        taleMemberDto.setImg(taleMember.getImg());
        taleMemberDto.setVoice(taleMember.getVoice());
        taleMemberDto.setScript(taleMember.getScript());
        taleMemberDto.setTaleId(taleMember.getTale().getId());
        taleMemberDto.setMemberId(taleMember.getMember().getId());
        taleMemberDto.setPromptSet(new PromptSet(taleMember.getPrompt(), taleMember.getNegativePrompt()));

        return taleMemberDto;
    }

    private TaleMember taleMemberDto2taleMember(TaleMemberDto taleMemberDto) {
        TaleMember taleMember = new TaleMember();
        taleMember.setId(taleMemberDto.getId());
        taleMember.setHas_host(taleMemberDto.getHas_host());
        taleMember.setKeyword(taleMemberDto.getKeyword());
        taleMember.setOrderNum(taleMemberDto.getOrderNum());
        taleMember.setOrginImg(taleMemberDto.getOrginImg());
        taleMember.setImg(taleMemberDto.getImg());
        taleMember.setImgScript(taleMemberDto.getImgScript());
        taleMember.setVoice(taleMemberDto.getVoice());
        taleMember.setScript(taleMemberDto.getScript());
        taleMember.setPrompt(taleMemberDto.getPromptSet().getPrompt());
        taleMember.setNegativePrompt(taleMemberDto.getPromptSet().getNegativePrompt());

        Member member = memberRepository.getReferenceById(taleMemberDto.getMemberId());
        taleMember.setMember(member);

        Tale tale = taleRepository.getReferenceById(taleMemberDto.getTaleId());
        taleMember.setTale(tale);

        return taleMember;
    }

    public RoomInviteResponseDto invite(RoomInviteRequestDto requestDto) {
        ValueOperations<String, Object> ops = redisTemplate.opsForValue();
        List<RoomInfo> roomList = (List<RoomInfo>) ops.get("tale-roomList");
        RoomInviteResponseDto responseDto = new RoomInviteResponseDto();
        for(RoomInfo roomInfo : roomList) {
            if(roomInfo.getRoomId().toString().equals(requestDto.getRoomId()) ){
                responseDto.setRoomInfo(roomInfo);
                break;
            }
        }
        Member member = memberRepository.findById(Long.parseLong(requestDto.getFrom())).get();
        responseDto.setFrom(requestDto.getFrom());
        responseDto.setTo(requestDto.getTo());
        responseDto.setRoomId(requestDto.getRoomId());
        responseDto.setNickname(member.getNickname());

        return responseDto;
    }
}
