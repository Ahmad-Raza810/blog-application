package com.projects.blog_application.repositories;

import com.projects.blog_application.domain.PostStatus;
import com.projects.blog_application.domain.entities.Category;
import com.projects.blog_application.domain.entities.Post;
import com.projects.blog_application.domain.entities.Tag;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface PostRepository extends JpaRepository<Post, UUID> {

   List<Post> findAllByPostStatusAndCategoryAndTagsContaining(PostStatus postStatus, Category category, Tag tag);
   List<Post> findAllByPostStatusAndCategory(PostStatus postStatus, Category category);
   List<Post> findAllByPostStatusAndTagsContaining(PostStatus postStatus, Tag tag);
   List<Post> findAllByPostStatus(PostStatus postStatus);
}
