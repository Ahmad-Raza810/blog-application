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
    @Size(min = 10, max = 200, message = "length of title should be in between {min} and {max}")
    @Pattern(regexp = "^[\\w\\s\\-.\\p{So}]+$",
            message = "Title can include letters, numbers, spaces, hyphens, underscores, full stops, and emojis.")
    private String title;

    @NotBlank(message = "content is required.")
    @Size(min = 20, max = 2000, message = "length of content should be in between {min} and {max}")
    @Pattern(regexp = "^[\\s\\S\\p{So}]{20,5000}$",
            message = "Content must be 20-5000 characters long and can include letters, numbers, spaces, punctuation, and emojis.")
    private String content;

    @NotNull(message = "Category ID is required")
    private UUID categoryId;

    @Builder.Default
    @Size(max = 10, message = "Maximum {max} tags allowed")
    private Set<UUID> tagIds = new HashSet<>();

    @NotNull(message = "Status is required")
    private PostStatus status;
}
