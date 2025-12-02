package com.projects.blog_application.domain.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;




@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequestDTO {


    @Size(min = 4,message = "size should be in range of 4 to 8 character.")
    @NotBlank(message = "name is required.")
    private String name;

    @Email(message = "Should be in valid email format.")
    @NotBlank(message = "email is required.")
    private String email;

    @Size(min = 4,message = "size should be in range of 4 to 8 character.")
    @NotBlank(message = "password is required.")
    private String password;

}
