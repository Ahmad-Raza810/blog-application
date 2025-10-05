package com.projects.blog_application.domain.dtos;

import com.projects.blog_application.domain.PostStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostResponseDTO {

    private UUID id;
    private String title;
    private String content;
    private Integer readTime;
    private AuthorDTO author;
    private PostStatus postStatus;
    private CategoryDTO category;
    private Set<TagResponseDTO> tags;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
