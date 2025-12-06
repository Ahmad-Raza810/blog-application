package com.projects.blog_application.service.Impl;


import com.projects.blog_application.domain.entities.User;
import com.projects.blog_application.repositories.UserRepository;
import com.projects.blog_application.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class UserServiceImpl implements  UserService{
    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    //service method for get user by id
    @Override
    public User getUserById(UUID id) {
       return userRepository.findById(id)
               .orElseThrow(()->new EntityNotFoundException("Entity not found."));
    }


}
