package com.projects.blog_application.service;

import com.projects.blog_application.domain.entities.User;

import java.util.UUID;

public interface UserService {

    User getUserById(UUID id);
}
