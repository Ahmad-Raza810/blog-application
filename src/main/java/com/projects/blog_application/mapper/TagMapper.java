package com.projects.blog_application.mapper;

import com.projects.blog_application.domain.PostStatus;
import com.projects.blog_application.domain.dtos.TagRequestDTO;
import com.projects.blog_application.domain.dtos.TagResponseDTO;
import com.projects.blog_application.domain.entities.Post;
import com.projects.blog_application.domain.entities.Tag;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.ReportingPolicy;

import java.util.List;
import java.util.Set;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface TagMapper {

    @Mapping(target = "postCount", source = "posts", qualifiedByName = "calculatePostCount")
    TagResponseDTO toDto(Tag tag);

    Tag toEntity(TagRequestDTO requestDTO);


    @Named("calculatePostCount")
    default long calculatePostCount(Set<Post> posts) {
        if (posts == null)
            return 0;
        else
            return posts.stream()
                    .filter(post -> PostStatus.PUBLISHED.equals(post.getPostStatus()))
                    .count();
    }
}
