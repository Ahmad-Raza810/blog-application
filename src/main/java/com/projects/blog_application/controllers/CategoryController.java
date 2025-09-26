package com.projects.blog_application.controllers;


import com.projects.blog_application.domain.dtos.CategoryDTO;
import com.projects.blog_application.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "api/v1/categories")
@RequiredArgsConstructor
public class CategoryController {

    private  final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<CategoryDTO> getAllCategory(){
        return categoryService.getAllCategory();
    }



}
