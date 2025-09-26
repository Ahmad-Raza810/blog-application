package com.projects.blog_application.mapper;


import com.projects.blog_application.domain.PostStatus;
import com.projects.blog_application.domain.dtos.CategoryDTO;
import com.projects.blog_application.domain.entities.Category;
import com.projects.blog_application.domain.entities.Post;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring" ,unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CategoryMapper {

    @Mapping(target = "postCount",source = "posts",qualifiedByName ="calculatePostCount")
    CategoryDTO toDto(Category category);


    @Named("calculatePostCount")
    default  long calculatePostCount(List<Post> posts){
        if (posts==null)
            return 0;
        else
           return  posts.stream()
                   .filter(post-> PostStatus.PUBLISHED.equals(post.getPostStatus()))
                   .count();
    }

}
