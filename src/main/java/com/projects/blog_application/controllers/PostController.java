package com.projects.blog_application.controllers;

import com.projects.blog_application.domain.dtos.PostResponseDTO;
import com.projects.blog_application.domain.entities.Post;
import com.projects.blog_application.mapper.PostMapper;
import com.projects.blog_application.response.ApiResponse;
import com.projects.blog_application.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(path = "/api/v1/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;
    private final PostMapper postMapper;

    @GetMapping
    public ResponseEntity<ApiResponse<List<PostResponseDTO>>> getAllPosts(
            @RequestParam(required = false)UUID categoryId,
            @RequestParam(required = false)UUID tagId) {

        List<Post> posts = postService.getAllPosts(categoryId,tagId);
        List<PostResponseDTO> dtos = posts.stream().map(postMapper::toDto).toList();

        ApiResponse<List<PostResponseDTO>> response = new ApiResponse<>(
                "Posts fetched successfully.",
                dtos,
                HttpStatus.OK.value(),
                true,
                LocalDateTime.now()
        );

        return ResponseEntity.ok(response);
    }

//    @PostMapping
//    public ResponseEntity<ApiResponse<PostResponseDTO>> createPost(@RequestBody @Valid PostRequestDTO requestDTO) {
//        Post savedPost = postService.createPost(requestDTO);
//        PostResponseDTO dto = postMapper.toDto(savedPost);
//
//        ApiResponse<PostResponseDTO> response = new ApiResponse<>(
//                "Post created successfully.",
//                dto,
//                HttpStatus.CREATED.value(),
//                true,
//                LocalDateTime.now()
//        );
//
//        return ResponseEntity.status(HttpStatus.CREATED).body(response);
//    }
//
//    @GetMapping("/{id}")
//    public ResponseEntity<ApiResponse<PostResponseDTO>> getPostById(@PathVariable UUID id) {
//        Post post = postService.getPostById(id);
//        PostResponseDTO dto = postMapper.toDto(post);
//
//        ApiResponse<PostResponseDTO> response = new ApiResponse<>(
//                "Post fetched successfully.",
//                dto,
//                HttpStatus.OK.value(),
//                true,
//                LocalDateTime.now()
//        );
//
//        return ResponseEntity.ok(response);
//    }
//
//    @DeleteMapping("/{id}")
//    public ResponseEntity<ApiResponse<Void>> deletePost(@PathVariable UUID id) {
//        postService.deletePost(id);
//
//        ApiResponse<Void> response = new ApiResponse<>(
//                "Post deleted successfully.",
//                null,
//                HttpStatus.OK.value(),
//                true,
//                LocalDateTime.now()
//        );
//
//        return ResponseEntity.ok(response);
//    }
//
//    @PutMapping("/{id}")
//    public ResponseEntity<ApiResponse<PostResponseDTO>> updatePost(
//            @PathVariable UUID id,
//            @RequestBody @Valid PostRequestDTO requestDTO) {
//
//        Post updatedPost = postService.updatePost(id, requestDTO);
//        PostResponseDTO dto = postMapper.toDto(updatedPost);
//
//        ApiResponse<PostResponseDTO> response = new ApiResponse<>(
//                "Post updated successfully.",
//                dto,
//                HttpStatus.OK.value(),
//                true,
//                LocalDateTime.now()
//        );
//
//        return ResponseEntity.ok(response);
//    }
}
