package com.ssafy.backend.tale.service;

import com.ssafy.backend.db.entity.BaseTale;
import com.ssafy.backend.db.entity.Member;
import com.ssafy.backend.db.entity.Tale;
import com.ssafy.backend.db.repository.MemberRepository;
import com.ssafy.backend.db.repository.TaleRepository;
import com.ssafy.backend.tale.dto.Room;
import com.ssafy.backend.tale.dto.request.JoinRoomRequestDto;
import com.ssafy.backend.tale.dto.request.LeaveRoomRequestDto;
import com.ssafy.backend.tale.dto.request.MakeRoomRequestDto;
import com.ssafy.backend.tale.dto.response.RoomInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;
import java.util.List;

/*
 *  author : park byeongju
 *  date : 2025.01.23
 *  description : 방 서비스
 *  update
 *      1.
 * */


@Service
@RequiredArgsConstructor
//@Transactional(readOnly = true)
public class RoomService {

    private final TaleRepository taleRepository;
    private final MemberRepository memberRepository;
    private final RedisTemplate<String, Object> redisTemplate;

    public Room makeRoom(MakeRoomRequestDto makeRoomDto) {

        System.out.println(makeRoomDto);
        // 방만들기
        // 1. 빈 방 만들기
        // input : MakeRoomRequestDto(creatorId=User136, partiCnt=4, baseTaleId=10)
        Tale tempRoom = new Tale();
        Member tempMember = new Member();
        BaseTale tempBaseTale = new BaseTale();
        Long creatorId = makeRoomDto.getMemberId();
        tempMember.setId(makeRoomDto.getMemberId());
        tempBaseTale.setId(makeRoomDto.getBaseTaleId());
        tempRoom.setMember(tempMember);
        tempRoom.setBaseTale(tempBaseTale);
        tempRoom.setPartiCnt(makeRoomDto.getPartiCnt());
        Tale tale = taleRepository.save(tempRoom);
        System.out.println(tale);


        // 2. 반환해 줄 Room 객체 생성
        Room room = new Room();

        Member creator = memberRepository.findById(makeRoomDto.getMemberId()).get();
        creator.setPassword(null);      // 패스워드 주석처리
        room.setRoomId(tale.getId());
        room.setBaseTaleId(makeRoomDto.getBaseTaleId());
        room.setMemberId(creatorId);
        room.setPartiCnt(makeRoomDto.getPartiCnt());
        room.getParticipants().put(creator.getId(), creator);

        // 3. Redis에 room id 값으로 저장
        ValueOperations<String, Object> ops = redisTemplate.opsForValue();
        ops.set(room.getRoomId().toString(), room);

        // RoomInfo List 갱신 및 저장
        List<RoomInfo> roomList = (List<RoomInfo>) ops.get("roomList");
        // roomList 없으면 생성
        if(roomList == null) roomList = new ArrayList<RoomInfo>();
        roomList.add(RoomInfo.builder()
                .roomId(room.getRoomId())
                .participantsCnt(room.getParticipants().size())
                .build());
        ops.set("roomList", roomList);
        

        System.out.println(room.getRoomId()+"번 방 레디스에 방 저장 ★");
        System.out.println(ops.get(room.getRoomId().toString()));

        //
        return room;
    }

    public Room joinRoom(JoinRoomRequestDto joinRoomRequestDto){
        ValueOperations<String, Object> ops = redisTemplate.opsForValue();
        Member joiner = memberRepository.findById(joinRoomRequestDto.getMemberId()).get();
        joiner.setPassword(null);
        Room room = (Room)ops.get(joinRoomRequestDto.getRoomId().toString());
        if(room != null){
            if(room.getParticipants().size() >= room.getPartiCnt()) throw new RuntimeException("꽉 찬 방인뎁쇼?");
            room.getParticipants().put(joiner.getId(), joiner);
        } else throw new RuntimeException("방 참가 실패");
        int cnt = room.getParticipants().size();
        if(cnt == room.getPartiCnt()) room.setFull(true);

        //redis room 갱신
        ops.set(room.getRoomId().toString(), room);
        //redis room list 갱신
        List<RoomInfo> roomList = (List<RoomInfo>) ops.get("roomList");
        for(RoomInfo roomInfo : roomList){
            if(roomInfo.getRoomId().equals(joinRoomRequestDto.getRoomId())){
                roomInfo.setParticipantsCnt(room.getParticipants().size());
            }
        }
        return room;
    }

    public Room getRoom(Room room){
        ValueOperations<String, Object> ops = redisTemplate.opsForValue();
        System.out.println("room = " + room);
        return (Room) ops.get(room.getRoomId().toString());
    }

    public List<RoomInfo> getRoomList(){
        ValueOperations<String, Object> ops = redisTemplate.opsForValue();
        return (List<RoomInfo>) ops.get("roomList");
    }

    /*
    *       방 나가기
    *       1. room 갱신
    *           - 참여자 제거
    *           - 호스트 갱신
    *           - 참여자 0명인 방은 삭제
    *           - full 여부 갱신
    *       2.
    * */
    public Room leaveRoom(LeaveRoomRequestDto leaveRoomRequestDto){
        ValueOperations<String, Object> ops = redisTemplate.opsForValue();
        List<RoomInfo> roomList = (List<RoomInfo>) ops.get("roomList");

        Room room = (Room)ops.get(leaveRoomRequestDto.getRoomId().toString());
        if(room == null) {
            throw new RuntimeException("유효하지 않은 방입니다.");
        }

        // Room 갱신
        Member leaveMember = room.getParticipants().get(leaveRoomRequestDto.getLeaveMemberId());
        room.getParticipants().remove(leaveMember.getId());
        room.setFull(false);

        if(room.getParticipants().isEmpty()) { // 호스트 0명일 경우 방 삭제
            redisTemplate.delete(room.getRoomId().toString());
            
            // room list 방 삭제
            for(RoomInfo roomInfo : roomList){
                if(roomInfo.getRoomId().equals(leaveRoomRequestDto.getRoomId())){
                    if(!roomList.remove(roomInfo)) throw new RuntimeException("방 리스트 삭제 실패");
                }
            }
            return null;
        }
        if(room.getMemberId().equals(leaveMember.getId())){ //방장이 나갈 경우 다른 참여자에게 방장 인계
            Collection<Member> participants = room.getParticipants().values();
            Iterator<Member> iterator = participants.iterator();
            Member nextHostMember = iterator.next();
            room.setMemberId(nextHostMember.getId());
        }

        ops.set(room.getRoomId().toString(), room);

        //redis room list 갱신

        for(RoomInfo roomInfo : roomList){
            if(roomInfo.getRoomId().equals(leaveRoomRequestDto.getRoomId())){
                roomInfo.setParticipantsCnt(room.getParticipants().size());
            }
        }
        return room;
    }

}