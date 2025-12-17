package com.projects.blog_application.controllers;

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
    public ResponseEntity<ApiResponse<List<Comment>>> getComments(
            @PathVariable UUID postId
    ) {
        List<Comment> comments = commentService.getCommentsByPost(postId);

        ApiResponse<List<Comment>> response = ApiResponse.<List<Comment>>builder()
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
}
