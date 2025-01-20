package com.ssafy.backend.guide.service;

import com.ssafy.backend.common.exception.BadRequestException;
import org.springframework.stereotype.Service;

/*
 *  author : park byeongju
 *  date : 2025.01.19
 *  description : 잘못된 요청 예외처리 예시
 *  update
 *      1.
 * */

@Service
public class GuideService {
    public void tryCatchGuide() {
        try{
            // Service logic
        }catch(Exception e){
            throw new BadRequestException("잘못된 요청입니다.");
        }
    }
}
