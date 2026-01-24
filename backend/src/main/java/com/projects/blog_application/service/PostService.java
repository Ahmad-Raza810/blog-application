package com.projects.blog_application.service;

import com.projects.blog_application.domain.dtos.CreatePostDTO;
import com.projects.blog_application.domain.dtos.PageResponse;
import com.projects.blog_application.domain.dtos.PostRequestDTO;
import com.projects.blog_application.domain.dtos.PostUpdateDTO;
import com.projects.blog_application.domain.entities.Post;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

public interface PostService {

    PageResponse getAllPosts(int pageSize, String cursor,UUID categoryId);

    List<Post> getDrafts(UUID id);

    Post createPost(CreatePostDTO createPostDTO, UUID userId, MultipartFile file);

    Post updatePost(UUID id, PostUpdateDTO postUpdateDTO, UUID userId, MultipartFile file,Boolean removeCoverImage);

    Post getPost(UUID id);

    void deletePost(UUID postId,UUID userId);

    List<Post> getAllPostByUserId(UUID userid);

    List<Post> getFeaturedPost();

    List<Post> getTrendingPosts();
}
