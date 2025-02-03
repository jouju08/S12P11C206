package com.ssafy.backend.tale.service;


import com.ssafy.backend.db.entity.Member;
import com.ssafy.backend.db.entity.Tale;
import com.ssafy.backend.db.repository.MemberRepository;
import com.ssafy.backend.db.repository.TaleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaleService {

    private final MemberRepository memberRepository;
    private final TaleRepository taleRepository;

    //내가 참여한 동화 목록 불러오기
    public List<Tale> getByUserId(Long userId) {
        Member member= memberRepository.getById(userId);
        List<Tale> taleList=member.getTales();
        return taleList;
    }

    //내가 참여한 동화의 디테일 확인
    public  Tale getByTale(Long taleId) {
        Tale tale=taleRepository.getById(taleId);
        return tale;
    }

}
