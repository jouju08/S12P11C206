package com.ssafy.backend.friends.service;

import com.ssafy.backend.db.entity.Member;
import com.ssafy.backend.db.repository.MemberRepository;
import org.hibernate.annotations.processing.Find;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Set;

@Service
public class ActiveService {
    private final StringRedisTemplate redisTemplate;
    private final MemberRepository memberRepository;

    public ActiveService(StringRedisTemplate redisTemplate, MemberRepository memberRepository) {
        this.redisTemplate=redisTemplate;
        this.memberRepository = memberRepository;
    }

    //접속 사용자 추가
    public void setMemberOnline(String loginId){
        redisTemplate.opsForSet().add("userOnline", loginId);
    }

    //접속 종료 사용자 제거
    public void setMemberOffline(String loginId){
        redisTemplate.opsForSet().remove("userOnline", loginId);
    }

    //접속 사용자 목록 가져오기
    public Set<String> getMemberOnline(){
        return redisTemplate.opsForSet().members("userOnline");
    }

    public boolean isMemberOnline(String loginId){
        try{
            if(redisTemplate.hasKey("userOnline")) {
                Boolean isMember = (Boolean) redisTemplate.opsForSet().isMember("userOnline", loginId);
                return Boolean.TRUE.equals(isMember);
            }
            else {
                System.out.println("userOnline Key is not exist");
                return false;
            }
        }catch(Exception e){
            System.out.println("Redis Err: "+e.getMessage());
            return false;
        }

    }
    public Long getMemberId(String loginId) {
        Optional<Member> member = memberRepository.findByLoginId(loginId);
        return member.get().getId();
    }
}
