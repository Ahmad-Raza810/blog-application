package com.projects.blog_application.service;

import com.projects.blog_application.domain.entities.RefreshToken;
import com.projects.blog_application.domain.entities.User;

public interface RefreshTokenService {

    RefreshToken verifyRefreshToken(String refreshToken);

    RefreshToken generateRefreshToken(User user);

    void deleteRefreshToken(RefreshToken refreshToken);
}
