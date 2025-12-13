package com.projects.blog_application.service;

import com.projects.blog_application.domain.dtos.*;
import org.springframework.security.core.Authentication;


public interface AuthService {


    LoginResponseDTO login(LoginRequestDTO requestDTO);

    RegisterResponseDTO register(RegisterRequestDTO registerRequestDTO);

    String logout(Authentication authentication);



}
