package com.projects.blog_application.mapper;

import com.projects.blog_application.domain.dtos.CommentResponseDTO;
import com.projects.blog_application.domain.entities.Comment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CommentMapper {
    @Mapping(source = "id", target = "commentId")
    @Mapping(source = "post.id", target = "postId")
    @Mapping(source = "user", target = "author")
    CommentResponseDTO toDto(Comment comment);
}
