package com.projects.blog_application.service.Impl;

import com.projects.blog_application.domain.Roles;
import com.projects.blog_application.domain.dtos.*;
import com.projects.blog_application.domain.entities.RefreshToken;
import com.projects.blog_application.domain.entities.User;
import com.projects.blog_application.exception.UserAlreadyExistsException;
import com.projects.blog_application.mapper.UserMapper;
import com.projects.blog_application.repositories.RefreshTokenRepository;
import com.projects.blog_application.repositories.UserRepository;
import com.projects.blog_application.security.CustomUserDetails;
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
    private final RefreshTokenServiceImpl refreshTokenService;
    private final RefreshTokenRepository refreshTokenRepository;


    //service method for login a user
    @Override
    public LoginResponseDTO login(LoginRequestDTO requestDTO) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(requestDTO.getEmail(), requestDTO.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String accessToken = jwtUtil.generateToken(requestDTO.getEmail());

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();


        RefreshToken refreshToken = refreshTokenService.generateRefreshToken(user);

        return new LoginResponseDTO(
                accessToken,
                jwtUtil.extractAllClaims(accessToken).getIssuedAt().getTime(),
                jwtUtil.extractAllClaims(accessToken).getExpiration().getTime(),
                refreshToken.getToken(),
                refreshToken.getExpDate().toEpochMilli()
        );

    }

    //service method for register new user
    @Override
    public RegisterResponseDTO register(RegisterRequestDTO registerRequestDTO) {
        User user = userMapper.toEntity(registerRequestDTO);
        if (userRepository.existsByEmail(user.getEmail()))
            throw new UserAlreadyExistsException("user already exists with provided email.");

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setUserRole(Roles.USER);
        return userMapper.toDto(userRepository.save(user));
    }

    @Override
    public String logout(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return "you are already logged out or not authenticated ";
        }
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        refreshTokenRepository.deleteByUserId(userDetails.getUser().getId());
        return "refresh token deleted,successfully log out.";
    }


}
