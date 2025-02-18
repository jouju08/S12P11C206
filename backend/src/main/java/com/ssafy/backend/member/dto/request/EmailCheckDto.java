package com.ssafy.backend.member.dto.request;

import lombok.Data;

/**
 * author : lee youngjae
 * date : 2025.02.18
 * description : 이메일 체크를 위한
 * update
 * 1.
 */

@Data
public class EmailCheckDto {

    private String email;
    private String authNum;
}