package com.projects.blog_application.mapper;

import com.projects.blog_application.domain.dtos.PostResponseDTO;
import com.projects.blog_application.domain.entities.Post;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring",unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface PostMapper {


    @Mapping(target = "author",source = "author")
    @Mapping(target = "category",source = "category")
    @Mapping(target = "tags",source = "tags")
    PostResponseDTO toDto(Post post);
}
