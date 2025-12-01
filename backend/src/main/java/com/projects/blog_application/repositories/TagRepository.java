package com.projects.blog_application.repositories;

import com.projects.blog_application.domain.dtos.TagResponseDTO;
import com.projects.blog_application.domain.entities.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Set;
import java.util.UUID;

public interface TagRepository extends JpaRepository<Tag, UUID> {

//    //preventing n+1 problem
//    @Query("SELECT t FROM Tag t LEFT JOIN FETCH t.posts")
//    List<Tag> findAllWithPostCount();


    @Query("""
            select new com.projects.blog_application.domain.dtos.TagResponseDTO(
                t.id,
                t.name,
                count(p)
            )
            from Tag t
            left join t.posts p with p.postStatus = com.projects.blog_application.domain.PostStatus.PUBLISHED
            group by t.id, t.name
            """)
    List<TagResponseDTO> findAllTagWithPublishedPostCount();


    @Query("""
            SELECT COUNT(p)
            FROM Post p
            JOIN p.tags t
            WHERE t.id = :tagId
            """)
    long countPostsByTag(UUID tagId);


    List<Tag> findByNameInIgnoreCase(Set<String> names);
}
