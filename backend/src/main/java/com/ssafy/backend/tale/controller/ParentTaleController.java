package com.ssafy.backend.tale.controller;

import com.ssafy.backend.common.dto.ApiResponse;
import com.ssafy.backend.common.exception.BadRequestException;
import com.ssafy.backend.db.entity.ParentBaseTale;
import com.ssafy.backend.db.repository.MemberRepository;
import com.ssafy.backend.tale.dto.common.ParentBaseTaleDto;
import com.ssafy.backend.tale.dto.response.*;
import com.ssafy.backend.tale.service.ParentBaseTaleService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 *  author : heo hyunjun
 *  date : 2025.02.16
 *  description : 부모가 동화 생성을 요청하는 컨트롤러
 *  update
 *      1.
 * */

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/parent/tale")
public class ParentTaleController {
    private final ParentBaseTaleService parentBaseTaleService;
    private final MemberRepository memberRepository;

    // basetale 저장
    @PostMapping("/base-tale")
    public  ApiResponse<Long> saveBaseTale(@RequestBody ParentBaseTaleDto parentBaseTaleDto) {
        // 부모가 승인한 동화는 승인된 동화는 저장하지 않음
        if(parentBaseTaleDto.getHasApproved() != null && parentBaseTaleDto.getHasApproved()) {
            throw new BadRequestException("승인된 동화는 저장할 수 없습니다.");
        }
        ParentBaseTale parentBaseTale = parentBaseTaleService.save(parentBaseTaleDto);
        return ApiResponse.<Long>builder().data(parentBaseTale.getId()).build();
    }

    @GetMapping("/base-tale/{id}")
    public ApiResponse<ParentBaseTaleDto> getBaseTale(@PathVariable Long id) { // requestBody title, intro, titleImage, introImage
        ParentBaseTaleDto parentBaseTale = parentBaseTaleService.getById(id);

        if(parentBaseTale == null) {
            throw new BadRequestException("해당 동화가 존재하지 않습니다.");
        }else if(parentBaseTale.getHasApproved() != null && parentBaseTale.getHasApproved()) {
            throw new BadRequestException("승인된 동화는 조회할 수 없습니다.");
        }

        return ApiResponse.<ParentBaseTaleDto>builder().data(parentBaseTale).build();
    }

    @GetMapping("/base-tale")
    public ApiResponse<List<ParentBaseTaleResponseDto>> getBaseTale(Authentication authentication) {
        Long memberId = getUserId(authentication);
        return ApiResponse.<List<ParentBaseTaleResponseDto>>builder().data(parentBaseTaleService.getList(memberId, false)).build();
    }

    private Long getUserId(Authentication authentication) {
        String loginId = authentication.getName();
        return memberRepository.findByLoginId(loginId).get().getId();
    }
}
