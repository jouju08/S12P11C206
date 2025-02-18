package com.ssafy.backend.tale.dto.common;

import lombok.*;

/**
 * author : HEO-hyunjun
 * date : 2025.01.31
 * description : tale member 엔티티를 redis에 넣기 위한 dto입니다.
 */

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class TaleMemberDto {
    private Long id;
    private Boolean has_host;
    private String keyword;
    private int orderNum;
    private String orginImg;
    private String img;
    private String voice;
    private String imgScript;
    private PromptSet promptSet;
    private String script;
    private Long taleId;
    private Long memberId;
}
