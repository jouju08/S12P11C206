package com.ssafy.backend.db.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Entity;
import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "base_tale")
@Data
public class BaseTale extends Common{

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



    // Tale (BaseTale 1 : N Tale)
    @OneToMany(mappedBy = "baseTale", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Tale> tales = new ArrayList<>();
}
