package com.projects.blog_application.controllers;

import com.projects.blog_application.domain.dtos.TagRequestDTO;
import com.projects.blog_application.domain.dtos.TagResponseDTO;
import com.projects.blog_application.domain.entities.Tag;
import com.projects.blog_application.mapper.TagMapper;
import com.projects.blog_application.response.ApiResponse;
import com.projects.blog_application.service.TagService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(path = "/api/v1/tags")
@RequiredArgsConstructor
public class TagController {


    private final TagService tagService;
    private final TagMapper mapper;


    //endpoint for get all tag.
    @GetMapping
    public ResponseEntity<ApiResponse<List<TagResponseDTO>>> getAllTags() {
        List<TagResponseDTO> tags = tagService.getAllTags();
        ApiResponse<List<TagResponseDTO>> response = new ApiResponse<>(
                "tags fetched successfully.",
                tags,
                HttpStatus.OK.value(),
                true,
                LocalDateTime.now()
        );

        return new ResponseEntity<>(response, HttpStatus.OK);

    }


    //api endpoint for create tags
    @PostMapping
    public ResponseEntity<ApiResponse<List<TagResponseDTO>>> createTag(@RequestBody @Valid TagRequestDTO requestDTO) {
        List<Tag> savedTag = tagService.createTags(requestDTO.getNames());


        List<TagResponseDTO> tagResponseDTOS = savedTag.
                stream()
                .map(mapper::toDto)
                .toList();


        ApiResponse<List<TagResponseDTO>> response = new ApiResponse<>(
                "tags created successfully.",
                tagResponseDTOS,
                HttpStatus.CREATED.value(),
                true,
                LocalDateTime.now()
        );

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }


    //api endpoint for delete a tag by id
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTag(@PathVariable UUID id) {
        tagService.deleteTag(id);

        ApiResponse<Void> response = new ApiResponse<>(
                "Tag deleted successfully.",
                null,
                HttpStatus.OK.value(),
                true,
                LocalDateTime.now()
        );

        return ResponseEntity.ok(response);
    }
}
