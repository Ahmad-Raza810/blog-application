package com.projects.blog_application.service;

import com.projects.blog_application.domain.entities.Comment;

import java.util.List;

public interface CommentService {
    List<Comment> getCommentsByPost(Long postId);
    void deleteComment(Long commentId);
}
