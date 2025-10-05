package com.projects.blog_application.service;

import com.projects.blog_application.domain.dtos.PostRequestDTO;
import com.projects.blog_application.domain.entities.Post;

import java.util.List;
import java.util.UUID;

public interface PostService {

    List<Post> getAllPosts(UUID categoryId,UUID tagId);

//    Post getPostById(UUID id);
//
//    Post createPost(PostRequestDTO postRequestDTO);
//
//    Post updatePost(UUID id, PostRequestDTO postRequestDTO);
//
//    void deletePost(UUID id);
}
