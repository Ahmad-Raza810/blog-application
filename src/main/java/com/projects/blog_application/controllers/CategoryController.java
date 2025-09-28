package com.projects.blog_application.controllers;


import com.projects.blog_application.domain.dtos.CategoryDTO;
import com.projects.blog_application.domain.dtos.CategoryRequestDTO;
import com.projects.blog_application.domain.entities.Category;
import com.projects.blog_application.mapper.CategoryMapper;
import com.projects.blog_application.response.ApiResponse;
import com.projects.blog_application.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(path = "api/v1/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryMapper categoryMapper;
    private  final CategoryService categoryService;



    //endpoint for getting all categories
    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoryDTO>>> getAllCategory(){
        List<CategoryDTO> categoryDTOList=categoryService.getAllCategory()
                .stream()
                .map(categoryMapper::toDto).toList();

        ApiResponse<List<CategoryDTO>> response=new ApiResponse<List<CategoryDTO>>(
                "Categories fetched successfully. ",
                categoryDTOList,
                HttpStatus.OK.value(),
                true,
                LocalDateTime.now()
        );

        return new ResponseEntity<>(response, HttpStatus.OK);
    }


    //endpoint for creating a category
    @PostMapping
    public ResponseEntity<ApiResponse<CategoryDTO>> createCategory(@RequestBody @Valid CategoryRequestDTO requestDTO){
        Category category=categoryMapper.toEntity(requestDTO);
        Category savedcategory=categoryService.createCategory(category);
        CategoryDTO categoryDTO=categoryMapper.toDto(savedcategory);

        ApiResponse<CategoryDTO> response=new ApiResponse<>(
                "category created  successfully. ",
                categoryDTO,
                HttpStatus.OK.value(),
                true,
                LocalDateTime.now()
        );

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }



    //endpoint for deleting a category
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteCategory(@PathVariable("id")UUID id){
        categoryService.deleteCategory(id);

        ApiResponse<String> response = ApiResponse.<String>builder()
                .message("Category deleted successfully.")
                .data("Category no longer exists.")
                .status(HttpStatus.NO_CONTENT.value())
                .success(true)
                .dateTime(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(response, HttpStatus.OK);

    }


}
