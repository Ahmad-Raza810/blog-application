package com.projects.blog_application.service.Impl;

import com.projects.blog_application.domain.dtos.AuthResponseDTO;
import com.projects.blog_application.domain.dtos.LoginRequestDTO;
import com.projects.blog_application.domain.dtos.RegisterRequestDTO;
import com.projects.blog_application.domain.dtos.RegisterResponseDTO;
import com.projects.blog_application.domain.entities.User;
import com.projects.blog_application.exception.UserAlreadyExistsException;
import com.projects.blog_application.mapper.UserMapper;
import com.projects.blog_application.repositories.UserRepository;
import com.projects.blog_application.security.JwtUtil;
import com.projects.blog_application.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;


    @Override
    public AuthResponseDTO login(LoginRequestDTO requestDTO) {
        Authentication authentication=authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(requestDTO.getEmail(),requestDTO.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token=jwtUtil.generateToken(requestDTO.getEmail());
        return new AuthResponseDTO(
                token,
                jwtUtil.extractAllClaims(token).getIssuedAt().getTime(),
                jwtUtil.extractAllClaims(token).getExpiration().getTime()

        );

    }

    @Override
    public RegisterResponseDTO register(RegisterRequestDTO registerRequestDTO) {
        User user=userMapper.toEntity(registerRequestDTO);
        if(userRepository.existsByEmail(user.getEmail()))
            throw new UserAlreadyExistsException("user already exists with provided email.");

        user.setPassword(passwordEncoder.encode(user.getPassword()));



        return userMapper.toDto(userRepository.save(user));
    }


}
