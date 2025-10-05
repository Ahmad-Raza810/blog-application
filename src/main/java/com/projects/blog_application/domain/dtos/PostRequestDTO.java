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
    @Size(min = 10,max = 40,message = "length of title should be in between {min} and {max}")
    @Pattern(regexp = "^[a-zA-Z0-9\\-\\s]+$",message = "Only letters, numbers, spaces and hyphens are allowed")
    private String title;


    @NotBlank(message = "content is required.")
    @Size(min = 20,max = 200,message = "length of title should be in between {min} and {max}")
    @Pattern(regexp = "^[a-zA-Z0-9\\-\\s]+$",message = "Only letters, numbers, spaces and hyphens are allowed")
    private String content;

    @NotNull(message = "read time is Required")
    private Integer readTime;
}
