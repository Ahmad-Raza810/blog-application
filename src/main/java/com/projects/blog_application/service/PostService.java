package com.projects.blog_application.service;

import com.projects.blog_application.domain.dtos.PostRequestDTO;
import com.projects.blog_application.domain.entities.Post;
import com.projects.blog_application.domain.entities.User;

import java.util.List;
import java.util.UUID;

public interface PostService {

    List<Post> getAllPosts(UUID categoryId,UUID tagId);

    List<Post> getDrafts(UUID id);



//    Post getPostById(UUID id);
//
    Post createPost(PostRequestDTO postRequestDTO,UUID id);
//
//    Post updatePost(UUID id, PostRequestDTO postRequestDTO);
//
//    void deletePost(UUID id);
}
