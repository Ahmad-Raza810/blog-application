package com.projects.blog_application.domain.dtos;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponseDTO {

    private String token;
    private long issuedAt;
    private long expiresAt;
    private String refreshToken;
    private long refExpiry;

}
