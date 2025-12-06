package com.projects.blog_application.util;

import com.projects.blog_application.domain.Roles;
import com.projects.blog_application.domain.dtos.RegisterRequestDTO;
import com.projects.blog_application.domain.entities.User;
import com.projects.blog_application.mapper.UserMapper;
import com.projects.blog_application.repositories.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class AdminLoader implements CommandLineRunner {


    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public AdminLoader(UserRepository userRepository, UserMapper userMapper, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {

        List<User> users = userRepository.findAll();

        List<User> admins = users.stream().filter(user -> user.getUserRole() == Roles.ADMIN).toList();

        if (admins.isEmpty()) {
            User adminOne = userMapper.toEntity(new RegisterRequestDTO("admin1", "admin1@gmail.com", "1234"));
            adminOne.setPassword(passwordEncoder.encode(adminOne.getPassword()));
            adminOne.setUserRole(Roles.ADMIN);

            User adminTwo = userMapper.toEntity(new RegisterRequestDTO("admin2", "admin2@gmail.com", "1234"));
            adminTwo.setUserRole(Roles.ADMIN);
            adminTwo.setPassword(passwordEncoder.encode(adminTwo.getPassword()));
            userRepository.saveAll(List.of(adminOne, adminTwo));

            System.out.println("Admin created successfully.");
        } else {
            System.out.println("Admin already exists.");
        }


    }
}
