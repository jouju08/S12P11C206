package com.ssafy.backend.member.controller;

import com.ssafy.backend.common.ApiResponse;
import com.ssafy.backend.common.auth.JwtUtil;
import com.ssafy.backend.db.entity.Member;
//import com.ssafy.backend.member.service.MemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/member")
public class MemberController {

//    @Autowired
//    private MemberService memberService;
//
//    @GetMapping("/mypage")
//    public ApiResponse<Member> getMember(String memberId) {
//        Member member = new Member();
//        member = memberService.GetMember(memberId);
//
//        return ApiResponse.<Member>builder()
//                .data(member)
//                .build();
//    }
//
//    @PatchMapping("/mypage")
//    public ApiResponse<Void> updateMember(Member member) {
//
//        memberService.ModifyMember(member);
//
//        return ApiResponse.<Void>builder()
//                .data(null)
//                .build();
//    }
//
//    @DeleteMapping("/delete")
//    public ApiResponse<Void> deleteMember(@RequestParam String memberId) {
//        memberService.DeleteMember(memberId);
//        return ApiResponse.<Void>builder()
//                .data(null)
//                .build();
//    }
}
