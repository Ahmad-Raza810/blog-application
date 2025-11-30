package com.projects.blog_application.service;

import com.projects.blog_application.domain.dtos.TagResponseDTO;
import com.projects.blog_application.domain.entities.Tag;

import java.util.List;
import java.util.Set;
import java.util.UUID;

public interface TagService {
    List<TagResponseDTO> getAllTags();

    Tag getTagById(UUID id);

    List<Tag> createTags(Set<String> names);

    void deleteTag(UUID id);

    List<Tag> getTagIds(Set<UUID> ids);

}
