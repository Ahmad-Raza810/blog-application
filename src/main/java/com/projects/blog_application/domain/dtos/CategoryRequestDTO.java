package com.projects.blog_application.domain.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CategoryRequestDTO {

    @NotBlank(message = "name is required.")
    @Size(min = 2,max = 50,message = "length of name  should be between {min} and {max} character.")
    @Pattern(regexp = "^[a-zA-Z0-9\\-\\s]+$",message = "Only letters, numbers, spaces and hyphens are allowed")
    private String name;

}
