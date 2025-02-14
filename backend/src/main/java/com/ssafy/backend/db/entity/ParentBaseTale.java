package com.ssafy.backend.db.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "parent_base_tale")
@Data
public class ParentBaseTale extends Common{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 50)
    private String title;        // 동화 제목

    @Column(length = 255)
    private String titleImg;     // 표지 이미지

    @Lob
    private String prompt;       // 프롬프트

    @Column(length = 255)
    private String startVoice;   // 시작 음성

    @Column(length = 255)
    private String startImg;     // 시작 이미지

    @Lob
    private String startScript;  // 시작 스크립트

    @Column(length = 20)
    private String keyword1;     // 기본 키워드1

    @Column(length = 20)
    private String keyword2;     // 기본 키워드2

    @Column(length = 20)
    private String keyword3;     // 기본 키워드3

    @Column(length = 20)
    private String keyword4;     // 기본 키워드4

    @Column(length=100)
    private String keywordSentence1; // 키워드1에 대한 문장

    @Column(length=100)
    private String keywordSentence2; // 키워드2에 대한 문장

    @Column(length=100)
    private String keywordSentence3; // 키워드3에 대한 문장

    @Column(length=100)
    private String keywordSentence4; // 키워드4에 대한 문장

    @Column
    private Long memberId; // 신청을 요청한 회원의 id

    @Column
    private Boolean hasApproved; // 관리자가 승인했는지 여부
}
