package com.ssafy.backend.tale.dto.request;

import com.ssafy.backend.tale.dto.response.PageInfo;
import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class DiffusionPromptRequestDto {
    private String title;
    List<PageInfo> pages;
}
