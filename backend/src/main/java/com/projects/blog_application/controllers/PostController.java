package com.projects.blog_application.controllers;

import com.projects.blog_application.domain.dtos.CreatePostDTO;
import com.projects.blog_application.domain.dtos.PageResponse;
import com.projects.blog_application.domain.dtos.PostResponseDTO;
import com.projects.blog_application.domain.dtos.PostUpdateDTO;
import com.projects.blog_application.domain.entities.Post;
import com.projects.blog_application.mapper.PostMapper;
import com.projects.blog_application.response.ApiResponse;
import com.projects.blog_application.service.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.channels.MulticastChannel;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(path = "/api/v1/posts")
@RequiredArgsConstructor
public class PostController {

        private final PostService postService;
        private final PostMapper postMapper;

        // endpoint for get all posts
        @GetMapping
        @Transactional(readOnly = true)
        public ResponseEntity<ApiResponse<PageResponse>> getAllPosts(
                        @RequestParam(required = false, defaultValue = "5") int pageSize,
                        @RequestParam(required = false) String cursor,
                        @RequestParam(required = false) UUID categoryId) {

                PageResponse pageResponse = postService.getAllPosts(pageSize, cursor, categoryId);

                ApiResponse<PageResponse> response = new ApiResponse<>(
                                "Posts fetched successfully.",
                                pageResponse,
                                HttpStatus.OK.value(),
                                true,
                                LocalDateTime.now());

                return ResponseEntity.ok(response);
        }

        // endpoint for getting drafts post(for only authenticated user)
        @GetMapping(path = "/drafts")
        public ResponseEntity<ApiResponse<List<PostResponseDTO>>> getDrafts(@RequestAttribute(value = "id") UUID id) {

                List<Post> drafts = postService.getDrafts(id);

                List<PostResponseDTO> responseDTOS = drafts.stream()
                                .map(postMapper::toDto).toList();

                ApiResponse<List<PostResponseDTO>> response = new ApiResponse<>(
                                "drafts posts fetched successfully.",
                                responseDTOS,
                                HttpStatus.OK.value(),
                                true,
                                LocalDateTime.now());

                return ResponseEntity.ok(response);
        }

        // endpoint for create post (for authenticated user only)
        @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        public ResponseEntity<ApiResponse<PostResponseDTO>> createPost(
                        @RequestPart(value = "post") @Valid CreatePostDTO requestDTO,
                        @RequestAttribute("id") UUID userId,
                        @RequestPart(value = "file", required = false) MultipartFile file) {
                Post savedPost = postService.createPost(requestDTO, userId, file);
                PostResponseDTO dto = postMapper.toDto(savedPost);

                ApiResponse<PostResponseDTO> response = new ApiResponse<>(
                                "Post created successfully.",
                                dto,
                                HttpStatus.CREATED.value(),
                                true,
                                LocalDateTime.now());

                return ResponseEntity.status(HttpStatus.CREATED).body(response);
        }

        // endpoint for get post by id (public)
        @GetMapping("/{id}")
        public ResponseEntity<ApiResponse<PostResponseDTO>> getPostById(@PathVariable UUID id) {
                Post post = postService.getPost(id);
                PostResponseDTO dto = postMapper.toDto(post);

                ApiResponse<PostResponseDTO> response = new ApiResponse<>(
                                "Post fetched successfully.",
                                dto,
                                HttpStatus.OK.value(),
                                true,
                                LocalDateTime.now());

                return ResponseEntity.ok(response);
        }

        // endpoint for delete post by id (for authenticated user only)
        @DeleteMapping("/{id}")
        public ResponseEntity<ApiResponse<Void>> deletePost(@PathVariable("id") UUID postId,
                        @RequestAttribute("id") UUID userId) {
                postService.deletePost(postId, userId);

                ApiResponse<Void> response = new ApiResponse<>(
                                "Post deleted successfully.",
                                null,
                                HttpStatus.OK.value(),
                                true,
                                LocalDateTime.now());

                return ResponseEntity.ok(response);
        }

        // endpoint for update post by id (for authenticated user only)
        @PutMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        public ResponseEntity<ApiResponse<PostResponseDTO>> updatePost(
                        @RequestPart("post") @Valid PostUpdateDTO postUpdateDTO,
                        @RequestAttribute("id") UUID userId,
                        @RequestPart(value = "file", required = false) MultipartFile file,
                        @RequestParam(value = "removeCoverImage", required = false) Boolean removeCoverImage) {

                Post updatedPost = postService.updatePost(postUpdateDTO.getId(), postUpdateDTO, userId, file,
                                removeCoverImage);
                PostResponseDTO dto = postMapper.toDto(updatedPost);

                ApiResponse<PostResponseDTO> response = new ApiResponse<>(
                                "Post updated successfully.",
                                dto,
                                HttpStatus.OK.value(),
                                true,
                                LocalDateTime.now());

                return ResponseEntity.ok(response);
        }

        // api endpoint for get all post of a user
        @GetMapping("/user")
        public ResponseEntity<ApiResponse<List<PostResponseDTO>>> getAllPostByUserId(
                        @RequestAttribute("id") UUID userId) {

                List<Post> allPosts = postService.getAllPostByUserId(userId);
                List<PostResponseDTO> dtos = allPosts.stream().map(postMapper::toDto).toList();

                ApiResponse<List<PostResponseDTO>> response = new ApiResponse<>(
                                "Posts fetched successfully.",
                                dtos,
                                HttpStatus.OK.value(),
                                true,
                                LocalDateTime.now());

                return ResponseEntity.ok(response);
        }

        // api endpoint for getting featured post
        @GetMapping("/featured")
        public ResponseEntity<ApiResponse<List<PostResponseDTO>>> getFeaturedPosts() {
                List<Post> featuredPost = postService.getFeaturedPost();

                List<PostResponseDTO> featuredPostDtos = featuredPost
                                .stream()
                                .map(postMapper::toDto)
                                .toList();

                ApiResponse<List<PostResponseDTO>> response = new ApiResponse<>(
                                "Featured Posts fetched successfully.",
                                featuredPostDtos,
                                HttpStatus.OK.value(),
                                true,
                                LocalDateTime.now());

                return ResponseEntity.ok(response);
        }

        // api endpoint for getting trending post
        @GetMapping("/trending")
        public ResponseEntity<ApiResponse<List<PostResponseDTO>>> getTrendingPosts() {
                List<Post> trendingPosts = postService.getTrendingPosts();

                List<PostResponseDTO> trendingPostDtos = trendingPosts
                                .stream()
                                .map(postMapper::toDto)
                                .toList();

                ApiResponse<List<PostResponseDTO>> response = new ApiResponse<>(
                                "Trending Posts fetched successfully.",
                                trendingPostDtos,
                                HttpStatus.OK.value(),
                                true,
                                LocalDateTime.now());

                return ResponseEntity.ok(response);
        }
}
