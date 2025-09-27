package com.projects.blog_application.service.Impl;

import com.projects.blog_application.domain.entities.Category;
import com.projects.blog_application.exception.ResourceNotFoundException;
import com.projects.blog_application.repositories.CategoryRepository;
import com.projects.blog_application.service.CategoryService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;


@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;


    @Override
    public List<Category> getAllCategory() {
        return categoryRepository.findAllWithPostCount();
    }

    @Override
    @Transactional
    public Category createCategory(Category category) {
        if ( categoryRepository.existsByName(category.getName())) {
           throw new ResourceNotFoundException("category with name " + category.getName() + "  already exists.");
        }
       return categoryRepository.save(category);

    }

    @Override
    @Transactional
    public void deleteCategory(UUID id) {
        categoryRepository.findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("category with id " + id + "not exists."));
        categoryRepository.deleteById(id);
    }
}
