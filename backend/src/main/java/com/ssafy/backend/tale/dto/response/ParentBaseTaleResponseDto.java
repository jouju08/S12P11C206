package com.ssafy.backend.tale.dto.response;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class ParentBaseTaleResponseDto {
    Long id;
    String title;
    String titleImg;
    boolean hasApproved;
}
