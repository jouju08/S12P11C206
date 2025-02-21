package com.ssafy.backend.friends.dto.request;

import lombok.Data;

/**
 * author : jung juha
 * date : 2025.02.18
 * description : 친구 신청 DTO
 * update
 * 1.
 */

@Data
public class FriendRequestDto {
    private String receiverLoginId;
}