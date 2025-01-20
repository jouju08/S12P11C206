package com.ssafy.backend.member.controller;

import com.ssafy.backend.common.ApiResponse;
import com.ssafy.backend.db.entity.Member;
import com.ssafy.backend.member.service.MemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/member")
public class MemberController {

    @Autowired
    private MemberService memberService;

    @GetMapping("/mypage")
    public ApiResponse<Member> getMember(@PathVariable("memberId") String memberId) {
        Member member = new Member();

        memberService.tryCatchGetMember(memberId);

        return ApiResponse.<Member>builder()
                .data(member)
                .build();
    }
}
