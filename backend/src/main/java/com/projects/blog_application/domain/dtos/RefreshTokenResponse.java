package com.projects.blog_application.domain.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RefreshTokenResponse {

    private String refreshToken;
    private String accessToken;
    private Instant refreshExpTime;
    private Instant accessExpTime;
}
