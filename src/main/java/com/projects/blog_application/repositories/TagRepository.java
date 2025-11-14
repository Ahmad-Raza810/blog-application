package com.projects.blog_application.repositories;

import com.projects.blog_application.domain.dtos.TagProjection;
import com.projects.blog_application.domain.entities.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Set;
import java.util.UUID;

public interface TagRepository extends JpaRepository<Tag, UUID> {

//    //preventing n+1 problem
//    @Query("SELECT DISTINCT t FROM Tag t LEFT JOIN t.posts")
//    List<Tag> findAllWithPostCount();


    @Query("SELECT t.id as id, t.name as name, COUNT(p) as postCount " +
            "FROM Tag t LEFT JOIN t.posts p " +
            "GROUP BY t.id, t.name")
    List<com.projects.blog_application.domain.dtos.TagProjection> findAllWithPostCount();

    // Create interface
    public interface TagProjection {
        UUID getId();
        String getName();
        Long getPostCount();
    }

    List<Tag> findByNameInIgnoreCase(Set<String> names);
}
