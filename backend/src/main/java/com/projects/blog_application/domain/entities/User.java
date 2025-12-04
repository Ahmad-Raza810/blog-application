package com.projects.blog_application.domain.entities;


import com.projects.blog_application.domain.Roles;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false,unique = true)
    @Email(message = "Should be in valid email format.")
    private String email;

    @Column(nullable = false)
    @Size(min = 4,message = "size should be in range of 4 to 8 character.")
    private String password;

    @Column(nullable = false)
    @Size(min = 4,message = "size should be in range of 4 to 8 character.")
    private String name;

    @OneToMany(orphanRemoval = true,cascade = CascadeType.ALL,mappedBy ="author")
    private List<Post> posts=new ArrayList<>();

    private LocalDateTime createdAt;
    @Enumerated(EnumType.STRING)
    private Roles userRole;

    @PrePersist
    protected void onCreate(){
        this.createdAt=LocalDateTime.now();
    }

}
