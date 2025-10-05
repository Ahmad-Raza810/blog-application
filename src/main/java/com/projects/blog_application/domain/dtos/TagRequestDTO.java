package com.projects.blog_application.domain.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TagRequestDTO {



    @NotEmpty(message = "tag names required.")
    @Size(max = 10,message = "Only allowed {max} as maximum")
    private Set<
            @NotBlank(message = "Tag cannot be blank")
            @Size(min = 3,max = 20, message = "size should be in between 3 to 20 character of range.")
            @Pattern(regexp = "^[a-zA-Z0-9\\-\\s]+$",message = "Only letters, numbers, spaces and hyphens are allowed")
            String> names;
}
