package com.projects.blog_application.domain.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;




@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequestDTO {


    @Size(min = 3,message = "size should be in range of 3 to 20 character.")
    @NotBlank(message = "name is required.")
    private String name;

    @Email(message = "Should be in valid email format.")
    @NotBlank(message = "email is required.")
    private String email;

    @Size(min = 6,message = "size should be in range of 6 to 20 character.")
    @NotBlank(message = "password is required.")
    @Pattern(
            regexp = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{6,}$",
            message = "Password must be at least 6 characters long and contain a letter, a number, and a special character"
    )
    private String password;

}
