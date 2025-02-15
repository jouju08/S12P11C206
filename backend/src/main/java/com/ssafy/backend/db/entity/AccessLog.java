package com.ssafy.backend.db.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "access_log")
@Data
public class AccessLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String requestUrl;
    private String method;
    private String ipAddress;
    private LocalDateTime timestamp;
}
