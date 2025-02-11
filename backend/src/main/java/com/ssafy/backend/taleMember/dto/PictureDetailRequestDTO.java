package com.ssafy.backend.taleMember.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class PictureDetailRequestDTO {
    private Long taleMemberId;
    private Long memberId;
}
