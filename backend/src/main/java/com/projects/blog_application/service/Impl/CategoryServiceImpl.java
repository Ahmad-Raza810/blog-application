package com.projects.blog_application.service.Impl;

import com.projects.blog_application.domain.entities.Category;
import com.projects.blog_application.exception.PostAvailableException;
import com.projects.blog_application.exception.ResourceAlreadyExistsException;
import com.projects.blog_application.exception.ResourceNotFoundException;
import com.projects.blog_application.repositories.CategoryRepository;
import com.projects.blog_application.service.CategoryService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;


@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;


    @Cacheable("categories")
    @Override
    public List<Category> getAllCategory() {
        return categoryRepository.findAllWithPostCount();
    }


    //service method for get category by id
    @Cacheable(value = "categories_ids", key = "#id")
    @Override
    public Category getCategoryById(UUID id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
    }

    //service method for create category
    @Override
    @Transactional
    @Caching(
            put = @CachePut(value = "categories_ids", key = "#result.id"),
            evict = @CacheEvict(value = "categories", allEntries = true)
    )
    public Category createCategory(Category category) {
        if (categoryRepository.existsByName(category.getName())) {
            throw new ResourceAlreadyExistsException("category with name '" + category.getName() + "'  already exists.");
        }
        return categoryRepository.save(category);

    }

    //service method for delete a category
    @Caching(
            evict = {
                    @CacheEvict(value = "categories_ids", key = "#id"),
                    @CacheEvict(value = "categories", allEntries = true)
            }
    )
    @Override
    @Transactional
    public void deleteCategory(UUID id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("category with id '" + id + "'  not exists."));

        if (category.getPosts() != null && !category.getPosts().isEmpty()) {
            throw new PostAvailableException("category has posts so it can't be deleted.");
        }
        categoryRepository.deleteById(id);


    }
}
