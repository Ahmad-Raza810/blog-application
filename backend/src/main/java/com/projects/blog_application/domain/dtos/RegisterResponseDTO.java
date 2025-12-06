package com.projects.blog_application.domain.dtos;

import com.projects.blog_application.domain.Roles;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterResponseDTO {

    private UUID id;
    private String email;
    private String name;
    private Roles userRole;
    private LocalDateTime createdAt;
}
