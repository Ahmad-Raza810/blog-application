package com.projects.blog_application.domain.dtos;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequestDTO {

    @NotBlank(message = "Email is required.")
    @Email(message = "Should be in a valid email format.")
    private String email;

    @NotBlank(message = "password is required.")
    private String password;
}
