package com.projects.blog_application.controllers;


import com.projects.blog_application.domain.dtos.AuthResponseDTO;
import com.projects.blog_application.domain.dtos.LoginRequestDTO;
import com.projects.blog_application.domain.dtos.RegisterRequestDTO;
import com.projects.blog_application.domain.dtos.RegisterResponseDTO;
import com.projects.blog_application.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    //api endpoint for login user
    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody @Valid LoginRequestDTO requestDTO) {
        AuthResponseDTO responseDTO = authService.login(requestDTO);
        return new ResponseEntity<>(responseDTO, HttpStatus.OK);


    }

    //api endpoint for register a new user
    @PostMapping("/register")
    public ResponseEntity<RegisterResponseDTO> register(@RequestBody @Valid RegisterRequestDTO requestDTO) {
        RegisterResponseDTO responseDTO = authService.register(requestDTO);
        return new ResponseEntity<>(responseDTO, HttpStatus.CREATED);
    }

}
