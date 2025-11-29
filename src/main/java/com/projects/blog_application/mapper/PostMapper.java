package com.projects.blog_application.mapper;

import com.projects.blog_application.domain.dtos.PostResponseDTO;
import com.projects.blog_application.domain.dtos.TagDTO;
import com.projects.blog_application.domain.entities.Post;
import com.projects.blog_application.domain.entities.Tag;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.ReportingPolicy;

import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring",unmappedTargetPolicy = ReportingPolicy.IGNORE ,uses = {CategoryMapper.class})
public interface PostMapper {


    @Mapping(target = "author",source = "author")
    @Mapping(target = "category",source = "category")
    @Mapping(target = "tags", qualifiedByName = "mapTags")
    PostResponseDTO toDto(Post post);

    @Named("mapTags")
    default Set<TagDTO> mapTags(Set<Tag> tags) {
        if (tags == null) return null;

        return tags.stream()
                .map(tag -> new TagDTO(tag.getId(), tag.getName()))
                .collect(Collectors.toSet());
    }
}
