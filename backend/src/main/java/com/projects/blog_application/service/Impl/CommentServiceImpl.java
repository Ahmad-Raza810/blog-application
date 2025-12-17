package com.projects.blog_application.service.Impl;

import com.projects.blog_application.domain.entities.Comment;
import com.projects.blog_application.exception.ResourceNotFoundException;
import com.projects.blog_application.repositories.CommentRepository;
import com.projects.blog_application.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;

    @Override
    public List<Comment> getCommentsByPost(UUID postId) {
        return commentRepository.findByPostIdOrderByCreatedAtAsc(postId);
    }

    @Override
    public void deleteComment(UUID commentId) {

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Comment not found with id: " + commentId
                        )
                );

        commentRepository.delete(comment);
    }
}
