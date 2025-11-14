package com.projects.blog_application.service.Impl;

import com.projects.blog_application.domain.entities.User;
import com.projects.blog_application.exception.ResourceNotFoundException;
import com.projects.blog_application.repositories.UserRepository;
import com.projects.blog_application.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService{

    private final UserRepository userRepository;

    @Override
    public User getUserById(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(()->new ResourceNotFoundException("User Not found with id:"+id));
    }
}
