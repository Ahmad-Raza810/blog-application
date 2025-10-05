package com.projects.blog_application.service.Impl;

import com.projects.blog_application.domain.entities.Category;
import com.projects.blog_application.exception.PostAvailableException;
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
    public Category getCategoryById(UUID id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
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
        Category category=categoryRepository.findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("category with id " + id + "not exists."));

        if (category.getPosts()!=null && !category.getPosts().isEmpty()) {
            throw  new PostAvailableException("category has posts so  it can't  be  deleted.");
        }
        categoryRepository.deleteById(id);


    }
}
