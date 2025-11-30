package com.projects.blog_application.controllers;


import com.projects.blog_application.domain.dtos.RegisterResponseDTO;
import com.projects.blog_application.domain.dtos.TagResponseDTO;
import com.projects.blog_application.domain.entities.User;
import com.projects.blog_application.mapper.UserMapper;
import com.projects.blog_application.response.ApiResponse;
import com.projects.blog_application.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(path = "api/v1/user")
public class UserController {

    private final UserService userService;
    private final UserMapper userMapper;

    public UserController(UserService userService, UserMapper userMapper) {
        this.userService = userService;
        this.userMapper = userMapper;
    }


    //api endpoint for get user profile
    @GetMapping
    public ResponseEntity<ApiResponse<RegisterResponseDTO>> getProfile(@RequestAttribute("id") UUID userId) {
        User user = userService.getUserById(userId);

        RegisterResponseDTO profile = userMapper.toDto(user);

        ApiResponse<RegisterResponseDTO> response = new ApiResponse<>(
                "profile fetched successfully.",
                profile,
                HttpStatus.OK.value(),
                true,
                LocalDateTime.now()
        );

        return new ResponseEntity<>(response, HttpStatus.OK);


    }
}
