package com.projects.blog_application.service;

import com.projects.blog_application.domain.entities.Comment;

import java.util.List;
import java.util.UUID;

public interface CommentService {
    List<Comment> getCommentsByPost(UUID postId);
    Comment createComment(UUID postId, String content);
    void deleteComment(UUID commentId);
}
