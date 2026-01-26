package com.projects.blog_application.domain.entities;


import com.projects.blog_application.domain.PostStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Post {


    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;


    @Column(nullable = false)
    private String title;

    @Column(nullable = false ,columnDefinition = "TEXT")
    private String content;


    @Column(nullable = false)
    private Integer readingTime;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name ="author_id", nullable = false)
    private User author;


    @Enumerated(EnumType.STRING)
    private PostStatus postStatus;

    private boolean isFeatured;

    private  boolean isTrending;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id",nullable = false)
    private Category category;

    @ManyToMany
    @JoinTable(
            name ="post_tag",
            joinColumns = @JoinColumn(name = "post_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")

    )
    private Set<Tag> tags=new HashSet<>();


    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    private String coverImageUrl;


    @PrePersist
    protected void onCreate(){
        LocalDateTime dateTime=LocalDateTime.now();
        this.createdAt=dateTime;
        this.updatedAt=dateTime;
    }

    @PreUpdate
    protected void onUpdate(){
        this.updatedAt=LocalDateTime.now();
    }




}
