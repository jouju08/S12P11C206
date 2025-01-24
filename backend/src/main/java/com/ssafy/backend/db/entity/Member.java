package com.ssafy.backend.db.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "member")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Member extends Common{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "login_id", length = 40, nullable = false)
    private String loginId;  // 멤버 아이디

    @Column(length = 60)
    private String password;  // 비밀번호(단방향암호화)

    @Column(length = 100)
    private String email;     // 이메일

    @Column(length = 20, nullable = false)
    private String nickname;  // 닉네임

    @Column(nullable = false, columnDefinition = "CHAR(1) DEFAULT 'E'")
    private Character loginType; // 로그인타입(소셜 타입), 기본 'E'

    @Column(nullable = false)
    private String birth;  // 생년월일

    @Column(nullable = false)
    private Boolean isDeleted = false; // 삭제여부

    @Column(name = "profile_img", length = 255)
    private String profileImg; // 프로필 이미지

    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Stamp> stamps = new ArrayList<>();

    // 친구 신청 보낸 경우 (Member 1 : N FriendRequest, "proposer")
    @OneToMany(mappedBy = "proposerMember", cascade = CascadeType.ALL)
    @Builder.Default
    private List<FriendRequest> sentFriendRequests = new ArrayList<>();

    // 친구 신청 받은 경우 (Member 1 : N FriendRequest, "recipient")
    @OneToMany(mappedBy = "receiverMember", cascade = CascadeType.ALL)
    @Builder.Default
    private List<FriendRequest> receivedFriendRequests = new ArrayList<>();

    // 친구 관계 (Member <-> Friend)
    // Friend 테이블은 복합키이므로, 직접 friendFrom / friendTo 매핑 가능
    @OneToMany(mappedBy = "fromMember", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Friend> friendFromList = new ArrayList<>();

    @OneToMany(mappedBy = "toMember", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Friend> friendToList = new ArrayList<>();

    // TaleMember (Member 1 : N TaleMember)
    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL)
    @Builder.Default
    private List<TaleMember> taleMembers = new ArrayList<>();

    // Gallery (Member 1 : N Gallery)
    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Gallery> galleries = new ArrayList<>();

    // GalleryLike (Member 1 : N GalleryLike)
    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL)
    @Builder.Default
    private List<GalleryLike> galleryLikes = new ArrayList<>();

    // TaleInvitation - 수신자
    @OneToMany(mappedBy = "receiver", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<TaleInvitation> receivedInvitations = new ArrayList<>();

    // TaleInvitation - 발신자
    @OneToMany(mappedBy = "senderMember", cascade = CascadeType.ALL)
    @Builder.Default
    private List<TaleInvitation> sentInvitations = new ArrayList<>();

    // Tale (Member 1 : N Tale)
    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Tale> tales = new ArrayList<>();
}
