package com.ssafy.backend.tale.controller;

import com.ssafy.backend.common.dto.ApiResponse;
import com.ssafy.backend.db.entity.BaseTale;
import com.ssafy.backend.db.repository.MemberRepository;
import com.ssafy.backend.tale.service.BaseTaleService;
import com.ssafy.backend.tale.service.TaleService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 *  author : park byeongju
 *  date : 2025.01.30
 *  description : 동화 주제 관련 컨트롤러,
 *  update
 *      1.
 * */
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/base-tale")
public class BaseTaleController {
    private final BaseTaleService baseTaleService;
    private final MemberRepository memberRepository;
    private final TaleService taleService;

    @GetMapping("/list")
    public ApiResponse<List<BaseTale>> getAll() {
        return ApiResponse.<List<BaseTale>>builder().data(baseTaleService.getList()).build();
    }

    @GetMapping("/{baseTaleId}")
    public ApiResponse<BaseTale> getTale(@PathVariable long baseTaleId) {
        return ApiResponse.<BaseTale>builder().data(baseTaleService.getById(baseTaleId)).build();
    }


}
