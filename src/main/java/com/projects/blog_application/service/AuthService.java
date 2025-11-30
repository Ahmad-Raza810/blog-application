package com.projects.blog_application.service;

import com.projects.blog_application.domain.dtos.AuthResponseDTO;
import com.projects.blog_application.domain.dtos.LoginRequestDTO;
import com.projects.blog_application.domain.dtos.RegisterRequestDTO;
import com.projects.blog_application.domain.dtos.RegisterResponseDTO;


public interface AuthService {


    AuthResponseDTO login(LoginRequestDTO requestDTO);

    RegisterResponseDTO register(RegisterRequestDTO registerRequestDTO);



}
