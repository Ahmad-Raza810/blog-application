package com.projects.blog_application.domain.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostRequestDTO {


    @NotBlank(message = "title is required.")
    @Size(min = 10,max = 200,message = "length of title should be in between {min} and {max}")
    @Pattern(regexp = "^[\\w\\s\\-\\p{So}]{3,100}$",
            message = "Title must be 3-100 characters long and can include letters, numbers, spaces, hyphens, underscores, and emojis.")
    private String title;


    @NotBlank(message = "content is required.")
    @Size(min = 20,max = 2000,message = "length of title should be in between {min} and {max}")
    @Pattern(regexp = "^[\\s\\S\\p{So}]{20,5000}$",
            message = "Content must be 20-5000 characters long and can include letters, numbers, spaces, punctuation, and emojis.")
    private String content;

    @NotNull(message = "read time is Required")
    private Integer readingTime;
}
