package com.projects.blog_application.service;

import com.projects.blog_application.domain.dtos.TagProjection;
import com.projects.blog_application.domain.dtos.TagResponseDTO;
import com.projects.blog_application.domain.entities.Tag;

import java.util.List;
import java.util.Set;
import java.util.UUID;

public interface TagService {
    List<TagProjection> getAllTags();
    Tag getTagById(UUID id);
    List<Tag> createTags(Set<String> names);
    void deleteTag(UUID id);
    List<Tag> getAllTagsByIds(Set<UUID> tagIds);
//
}
