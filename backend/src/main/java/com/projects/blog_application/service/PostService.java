package com.projects.blog_application.service;

import com.projects.blog_application.domain.dtos.CreatePostDTO;
import com.projects.blog_application.domain.dtos.PostRequestDTO;
import com.projects.blog_application.domain.dtos.PostUpdateDTO;
import com.projects.blog_application.domain.entities.Post;

import java.util.List;
import java.util.UUID;

public interface PostService {

    List<Post> getAllPosts(UUID categoryId, UUID tagId);

    List<Post> getDrafts(UUID id);

    Post createPost(CreatePostDTO createPostDTO, UUID userId);

    Post updatePost(UUID id, PostUpdateDTO postUpdateDTO, UUID userId);

    Post getPost(UUID id);

    void deletePost(UUID postId,UUID userId);

    List<Post> getAllPostByUserId(UUID userid);
}
