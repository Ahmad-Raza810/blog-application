package com.projects.blog_application.domain.dtos;

import com.projects.blog_application.domain.PostStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class CreatePostDTO {

    @NotBlank(message = "title is required.")
    @Size(min = 10, max = 40, message = "length of title should be in between {min} and {max}")
    @Pattern(regexp = "^[a-zA-Z0-9\\-\\s]+$", message = "Only letters, numbers, spaces and hyphens are allowed")
    private String title;

    @NotBlank(message = "content is required.")
    @Size(min = 20, max = 5000, message = "length of content should be in between {min} and {max}")
    private String content; // no regex

    @NotNull(message = "Category ID is required")
    private UUID categoryId;

    @Builder.Default
    @Size(max = 10, message = "Maximum {max} tags allowed")
    private Set<UUID> tagIds = new HashSet<>();

    @NotNull(message = "Status is required")
    private PostStatus status;
}
