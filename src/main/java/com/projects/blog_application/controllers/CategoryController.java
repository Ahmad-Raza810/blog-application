package com.projects.blog_application.controllers;


import com.projects.blog_application.domain.dtos.CategoryDTO;
import com.projects.blog_application.domain.dtos.CategoryRequestDTO;
import com.projects.blog_application.domain.entities.Category;
import com.projects.blog_application.mapper.CategoryMapper;
import com.projects.blog_application.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "api/v1/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryMapper categoryMapper;
    private  final CategoryService categoryService;


    //endpoint for getting all categories
    @GetMapping
    public ResponseEntity<List<CategoryDTO>> getAllCategory(){
        List<CategoryDTO> categoryDTOList=categoryService.getAllCategory()
                .stream()
                .map(categoryMapper::toDto).toList();


        return new ResponseEntity<>(categoryDTOList, HttpStatus.OK);
    }


    //endpoint for creating a category
    @PostMapping
    public ResponseEntity<CategoryDTO> createCategory(@RequestBody @Valid CategoryRequestDTO requestDTO){
        Category category=categoryMapper.toEntity(requestDTO);
        Category savedcategory=categoryService.createCategory(category);
        CategoryDTO categoryDTO=categoryMapper.toDto(savedcategory);
        return new ResponseEntity<>(categoryDTO, HttpStatus.CREATED);
    }


}
