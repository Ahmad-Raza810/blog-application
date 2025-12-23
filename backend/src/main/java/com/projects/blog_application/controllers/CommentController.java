package com.projects.blog_application.controllers;
import com.projects.blog_application.domain.dtos.CommentResponseDTO;
import com.projects.blog_application.domain.dtos.CreateCommentRequest;
import com.projects.blog_application.domain.entities.Comment;
import com.projects.blog_application.response.ApiResponse;
import com.projects.blog_application.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @GetMapping("/posts/{postId}/comments")
    public ResponseEntity<ApiResponse<List<CommentResponseDTO>>> getComments(
            @PathVariable UUID postId
    ) {
        List<CommentResponseDTO> comments = commentService.getCommentsByPost(postId);

        ApiResponse<List<CommentResponseDTO>> response = ApiResponse.<List<CommentResponseDTO>>builder()
                .message("Comments fetched successfully")
                .data(comments)
                .status(HttpStatus.OK.value())
                .success(true)
                .dateTime(LocalDateTime.now())
                .build();

        return ResponseEntity.ok(response);
    }


    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<ApiResponse<Void>> deleteComment(
            @PathVariable UUID commentId
    ) {
        commentService.deleteComment(commentId);

        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .message("Comment deleted successfully")
                .data(null)
                .status(HttpStatus.OK.value())
                .success(true)
                .dateTime(LocalDateTime.now())
                .build();

        return ResponseEntity.ok(response);
    }
    @PostMapping("/posts/{postId}/comments")
    public ResponseEntity<ApiResponse<Comment>> createComment(
            @PathVariable UUID postId,
            @RequestBody CreateCommentRequest request
    ) {
        Comment comment = commentService.createComment(
                postId,
                request.getContent()
        );

        ApiResponse<Comment> response = ApiResponse.<Comment>builder()
                .message("Comment added successfully")
                .data(comment)
                .status(HttpStatus.CREATED.value())
                .success(true)
                .dateTime(LocalDateTime.now())
                .build();

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

}
