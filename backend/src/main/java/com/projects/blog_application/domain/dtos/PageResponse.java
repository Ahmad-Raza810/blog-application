package com.projects.blog_application.domain.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class PageResponse {
    private List<PostResponseDTO> posts;
    private String cursor;
    private boolean hasMore;

}
