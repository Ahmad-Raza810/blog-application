package com.projects.blog_application.domain.dtos;

import java.util.UUID;

public interface TagProjection {
    UUID getId();
    String getName();
    Long getPostCount();
}
