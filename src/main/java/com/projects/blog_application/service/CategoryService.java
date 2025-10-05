package com.projects.blog_application.service;

import com.projects.blog_application.domain.entities.Category;

import java.util.List;
import java.util.UUID;

public interface CategoryService {
    List<Category> getAllCategory();
    Category getCategoryById(UUID id);
    Category createCategory(Category category);
    void deleteCategory(UUID id);
}
