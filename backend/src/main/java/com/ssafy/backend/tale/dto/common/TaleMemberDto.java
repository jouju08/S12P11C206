package com.ssafy.backend.tale.dto.common;

import com.ssafy.backend.db.entity.TaleMember;
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

    static public TaleMemberDto parse(TaleMember taleMember) {
        TaleMemberDto taleMemberDto = new TaleMemberDto();
        taleMemberDto.setId(taleMember.getId());
        taleMemberDto.setHas_host(taleMember.getHas_host());
        taleMemberDto.setKeyword(taleMember.getKeyword());
        taleMemberDto.setOrderNum(taleMember.getOrderNum());
        taleMemberDto.setOrginImg(taleMember.getOrginImg());
        taleMemberDto.setImg(taleMember.getImg());
        taleMemberDto.setVoice(taleMember.getVoice());
        taleMemberDto.setScript(taleMember.getScript());
        taleMemberDto.setTaleId(taleMember.getTale().getId());
        taleMemberDto.setMemberId(taleMember.getMember().getId());
        taleMemberDto.setPromptSet(new PromptSet(taleMember.getPrompt(), taleMember.getNegativePrompt()));

        return taleMemberDto;
    }

    static public TaleMember parse(TaleMemberDto taleMemberDto) {
        TaleMember taleMember = new TaleMember();
        taleMember.setId(taleMemberDto.getId());
        taleMember.setHas_host(taleMemberDto.getHas_host());
        taleMember.setKeyword(taleMemberDto.getKeyword());
        taleMember.setOrderNum(taleMemberDto.getOrderNum());
        taleMember.setOrginImg(taleMemberDto.getOrginImg());
        taleMember.setImg(taleMemberDto.getImg());
        taleMember.setVoice(taleMemberDto.getVoice());
        taleMember.setScript(taleMemberDto.getScript());
        taleMember.setPrompt(taleMemberDto.getPromptSet().getPrompt());
        taleMember.setNegativePrompt(taleMemberDto.getPromptSet().getNegativePrompt());
        return taleMember;
    }
}
