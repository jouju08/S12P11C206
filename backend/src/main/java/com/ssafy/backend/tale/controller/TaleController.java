package com.ssafy.backend.tale.controller;

import com.ssafy.backend.common.ApiResponse;
import com.ssafy.backend.db.entity.Tale;
import com.ssafy.backend.db.repository.MemberRepository;
import com.ssafy.backend.tale.service.TaleService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/tale")
public class TaleController {
    private final MemberRepository memberRepository;
    private final TaleService taleService;


    @GetMapping("/my-tale")
    public ApiResponse<List<Tale>> getMyTale(Authentication authentication) {
        User user=(User) authentication.getPrincipal();
        Long UserId=memberRepository.findByLoginId(user.getUsername()).get().getId();
        List<Tale> taleList=taleService.getByUserId(UserId);
        return ApiResponse.<List<Tale>>builder().data(taleList).build();
    }

    //동화 디테일
    @GetMapping("/{taleId}")
    public ApiResponse<Tale> getDetail(@PathVariable long taleId) {
        Tale tale=taleService.getByTale(taleId);
        return ApiResponse.<Tale>builder().data(tale).build();
    }

}
