package com.projects.blog_application.repositories;

import com.projects.blog_application.domain.entities.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Set;
import java.util.UUID;

public interface TagRepository extends JpaRepository<Tag, UUID> {

    //preventing n+1 problem
    @Query("SELECT t FROM Tag t LEFT JOIN FETCH t.posts")
    List<Tag> findAllWithPostCount();

    List<Tag> findByNameInIgnoreCase(Set<String> names);
}
