package com.projects.blog_application.domain.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class CommentResponseDTO {
    private UUID commentId;
    private String content;
    private UUID postId;
    private AuthorDTO author;

}
