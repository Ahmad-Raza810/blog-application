package com.projects.blog_application.domain.dtos;

import com.projects.blog_application.domain.Roles;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthorDTO {

    private UUID id;
    private String name;
    private Roles userRole;
}
