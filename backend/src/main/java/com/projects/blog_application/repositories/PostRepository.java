package com.projects.blog_application.repositories;

import com.projects.blog_application.domain.PostStatus;
import com.projects.blog_application.domain.entities.Category;
import com.projects.blog_application.domain.entities.Post;
import com.projects.blog_application.domain.entities.Tag;
import com.projects.blog_application.domain.entities.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface PostRepository extends JpaRepository<Post, UUID> {

//    List<Post> findAllByPostStatusAndCategoryAndTagsContaining(PostStatus postStatus, Category category, Tag tag);
//
//    List<Post> findAllByPostStatusAndCategory(PostStatus postStatus, Category category);
//
//    List<Post> findAllByPostStatusAndTagsContaining(PostStatus postStatus, Tag tag);
//
//    List<Post> findAllByPostStatus(PostStatus postStatus);

    List<Post> findAllByAuthorAndPostStatus(User user, PostStatus postStatus);

    List<Post> findAllByAuthor(User user);

    List<Post> findTop5ByIsFeaturedTrueAndPostStatusOrderByCreatedAtDesc(PostStatus postStatus);

    List<Post> findTByIsTrendingTrueAndPostStatusOrderByCreatedAtDesc(PostStatus postStatus);

    List<Post> findByPostStatusOrderByCreatedAtDesc(Pageable pageable,PostStatus postStatus);

    List<Post> findByPostStatusAndCategoryIdOrderByCreatedAtDesc(
            PostStatus postStatus,
            UUID categoryId,
            Pageable pageable
    );

    List<Post> findByPostStatusAndCategoryIdAndCreatedAtLessThanOrderByCreatedAtDesc(
            PostStatus postStatus,
            UUID categoryId,
            LocalDateTime cursor,
            Pageable pageable
    );



    List<Post> findByPostStatusAndCreatedAtLessThanOrderByCreatedAtDesc(
            PostStatus status,
            LocalDateTime cursor,
            Pageable pageable
    );

}
