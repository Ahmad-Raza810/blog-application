package com.projects.blog_application.service.Impl;

import com.projects.blog_application.domain.entities.Category;
import com.projects.blog_application.repositories.CategoryRepository;
import com.projects.blog_application.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;


    @Override
    public List<Category> getAllCategory() {
        return categoryRepository.findAllWithPostCount();
    }
}
