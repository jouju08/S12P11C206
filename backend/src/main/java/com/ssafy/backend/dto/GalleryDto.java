package com.ssafy.backend.dto;

import com.ssafy.backend.db.entity.Gallery;
import com.ssafy.backend.db.entity.GalleryLike;
import com.ssafy.backend.db.entity.Member;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class GalleryDto {
    private Long id;
    private String imgPath;
    private Boolean isOrigin;
}

