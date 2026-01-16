package com.projects.blog_application.service.Impl;


import com.projects.blog_application.domain.dtos.TagResponseDTO;
import com.projects.blog_application.domain.entities.Tag;
import com.projects.blog_application.exception.PostAvailableException;
import com.projects.blog_application.exception.ResourceNotFoundException;
import com.projects.blog_application.repositories.TagRepository;
import com.projects.blog_application.service.TagService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TagServiceImpl implements TagService {

    private final TagRepository tagRepository;

    //service method get all tags
    @Cacheable("tags")
    @Override
    public List<TagResponseDTO> getAllTags() {
        return tagRepository.findAllTagWithPublishedPostCount();
    }


    //service method for get tag by id
    @Cacheable(value = "tags_ids",key ="#id")
    @Override
    public Tag getTagById(UUID id) {
        return tagRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tag not found with id: " + id));
    }


    //service method for create tags
    @CacheEvict(
            value = "tags",
            allEntries = true
    )
    @Override
    @Transactional
    public List<Tag> createTags(Set<String> names) {

        // remove duplicates in input (case-insensitive)
        Set<String> uniqueNames = names.stream()
                .map(String::trim)
                .map(String::toLowerCase) // normalize
                .collect(Collectors.toSet());

        // fetch existing tags (case-insensitive)
        List<Tag> existingTags = tagRepository.findByNameInIgnoreCase(uniqueNames);

        // collect existing names (lowercase)
        Set<String> existingTagNamesLower = existingTags.stream()
                .map(tag -> tag.getName().toLowerCase())
                .collect(Collectors.toSet());

        // filter new tags (ignore duplicates and existing tags)
        List<Tag> newTags = uniqueNames.stream()
                .filter(name -> !existingTagNamesLower.contains(name))
                .map(name -> Tag.builder()
                        .name(name)
                        .posts(new HashSet<>())
                        .build())
                .toList();

        // save new tags
        List<Tag> savedTags = tagRepository.saveAll(newTags);

        // return all tags (existing + newly saved)
        List<Tag> allTags = new ArrayList<>();
        allTags.addAll(existingTags);
        allTags.addAll(savedTags);

        return allTags;
    }


    //service method for delete tag by id
    @Override
    @Transactional
    @Caching(
            evict = {
                    @CacheEvict(value="tags_ids",key="#id"),
                    @CacheEvict(value = "tags",allEntries = true)
            }
    )
    public void deleteTag(UUID id) {

        Tag tag = tagRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tag not exist with provided id"));

        long postCount = tagRepository.countPostsByTag(id);

        if (postCount == 0) {
            tagRepository.deleteById(id);
        } else {
            throw new PostAvailableException("tag have related post so it can't be deleted.");
        }
    }

    //service method for get tags by ids
    @Override
    public List<Tag> getTagIds(Set<UUID> ids) {
        List<Tag> foundTags=tagRepository.findAllById(ids);
        if (foundTags.size()!=ids.size()) {

            //get found tag ids
            Set<UUID> foundTagIds=foundTags.stream()
                    .map(Tag::getId)
                    .collect(Collectors.toSet());

            Set<UUID> notFoundTags=new HashSet<>(ids);
            notFoundTags.removeAll(foundTagIds);

            throw  new ResourceNotFoundException("Tags with ids "+notFoundTags+" not found");
        }
        return  foundTags;
    }


}

