package com.projects.blog_application.controllers;


import com.projects.blog_application.domain.dtos.CategoryDTO;
import com.projects.blog_application.mapper.CategoryMapper;
import com.projects.blog_application.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(path = "api/v1/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryMapper categoryMapper;
    private  final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<List<CategoryDTO>> getAllCategory(){
        List<CategoryDTO> categoryDTOList=categoryService.getAllCategory()
                .stream()
                .map(categoryMapper::toDto).toList();


        return new ResponseEntity<>(categoryDTOList, HttpStatus.OK);
    }



}
