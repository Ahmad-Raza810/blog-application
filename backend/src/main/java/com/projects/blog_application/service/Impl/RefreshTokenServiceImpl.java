package com.projects.blog_application.service.Impl;


import com.projects.blog_application.domain.entities.RefreshToken;
import com.projects.blog_application.domain.entities.User;
import com.projects.blog_application.exception.RefreshTokenExpiredException;
import com.projects.blog_application.exception.RefreshTokenInvalidException;
import com.projects.blog_application.repositories.RefreshTokenRepository;
import com.projects.blog_application.service.RefreshTokenService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
public class RefreshTokenServiceImpl implements RefreshTokenService {

    @Value("${refreshToken.exptime}")
    private Long expTime;

    public RefreshTokenServiceImpl(RefreshTokenRepository refreshTokenRepository) {
        this.refreshTokenRepository = refreshTokenRepository;
    }

    private final RefreshTokenRepository refreshTokenRepository;

    //service method for create refresh token
    @Transactional
    @Override
    public RefreshToken generateRefreshToken(User user) {

        // Rotation - delete old token for this user
        refreshTokenRepository.deleteByUserId(user.getId());

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(user);
        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken.setExpDate(Instant.now().plusMillis(expTime));

        return refreshTokenRepository.save(refreshToken);
    }


    //service method for verify refresh token
    @Transactional
    @Override
    public RefreshToken verifyRefreshToken(String token) {
        RefreshToken refreshToken = refreshTokenRepository
                .findByToken(token)
                .orElseThrow(() -> new RefreshTokenInvalidException("token is invalid."));

        if (refreshToken.getExpDate().isBefore(Instant.now())) {
            refreshTokenRepository.delete(refreshToken);
            throw new RefreshTokenExpiredException("refresh Token is expired");
        }

        return refreshToken;
    }

    // DELETE TOKEN (used during rotation)
    @Override
    public void deleteRefreshToken(RefreshToken token) {
        refreshTokenRepository.delete(token);
    }
}
