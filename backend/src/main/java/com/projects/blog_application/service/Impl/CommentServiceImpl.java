package com.projects.blog_application.service.Impl;

import com.projects.blog_application.domain.dtos.CommentResponseDTO;
import com.projects.blog_application.domain.entities.Post;
import com.projects.blog_application.domain.entities.User;
import com.projects.blog_application.domain.entities.Comment;
import com.projects.blog_application.exception.ResourceNotFoundException;
import com.projects.blog_application.mapper.CommentMapper;
import com.projects.blog_application.repositories.PostRepository;
import com.projects.blog_application.repositories.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import com.projects.blog_application.repositories.CommentRepository;
import com.projects.blog_application.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final CommentMapper commentMapper;

    @Override
    public List<CommentResponseDTO> getCommentsByPost(UUID postId) {
        return commentRepository.findByPostIdOrderByCreatedAtAsc(postId)
                .stream()
                .map(commentMapper::toDto)
                .toList();

    }
    @Transactional
    @Override
    public Comment createComment(UUID postId, String content) {

        Post post = postRepository.findById(postId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Post not found with id: " + postId)
                );

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found with email: " + email)
                );


        Comment comment = Comment.builder()
                .content(content)
                .post(post)
                .user(user)
                .build();

        return commentRepository.save(comment);
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
