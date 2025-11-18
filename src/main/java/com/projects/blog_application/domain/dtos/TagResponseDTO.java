package com.projects.blog_application.domain.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class TagResponseDTO {
    private UUID id;
    private String name;
    private Long postCount;
}
