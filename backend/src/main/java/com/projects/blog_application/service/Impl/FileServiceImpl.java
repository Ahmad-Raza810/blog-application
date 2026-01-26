package com.projects.blog_application.service.Impl;

import com.projects.blog_application.domain.entities.Post;
import com.projects.blog_application.exception.FileValidationException;
import com.projects.blog_application.exception.ResourceNotFoundException;
import com.projects.blog_application.repositories.PostRepository;
import com.projects.blog_application.service.FileService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Set;
import java.util.UUID;

@Service
public class FileServiceImpl implements FileService {

    private final Path root;
    private static final Set<String> allowedType = Set.of("image/jpg", "image/jpeg", "image/png");
    private final PostRepository postRepository;

    public FileServiceImpl(@Value("${file.upload.dir}") Path uploadPath, PostRepository postRepository) {
        this.root = uploadPath.toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.root);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize upload directory", e);
        }
        this.postRepository = postRepository;
    }

    @Override
    public String saveImage(MultipartFile file) {
        validateImage(file);
        String fileName = sanitizeImageName(file);

        Path targetPath = root.resolve(fileName);

        try (InputStream is = file.getInputStream()) {
            Files.copy(is, targetPath);
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file", e);
        }

        return fileName;
    }

    @Override
    public String getImage() {
        return "";
    }

    @Transactional
    @Override
    public void deleteImage(UUID postId) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new ResourceNotFoundException("post not found"));
        Path coverImagePath = root.resolve(post.getCoverImageUrl());
        if (Files.exists(coverImagePath)) {
            try {
                Files.delete(coverImagePath);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
        post.setCoverImageUrl(null);
        postRepository.save(post);
    }

    private void validateImage(MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new FileValidationException("file is not valid or empty.");
        }

        if (file.getSize() > 2 * 1024 * 1024) {
            throw new FileValidationException("Image size must be less than 2MB.");
        }

        System.out.println("Filename: " + file.getOriginalFilename());
        System.out.println("Content-Type: {}" + file.getContentType());

        String contentType = file.getContentType();
        if (contentType == null || !allowedType.contains(contentType.toLowerCase())) {
            throw new FileValidationException("file type is not supported");
        }

    }

    private String sanitizeImageName(MultipartFile file) {
        String fileName = file.getOriginalFilename();
        if (!StringUtils.hasText(fileName)) {
            throw new RuntimeException("file name is not available");
        }

        if (fileName.lastIndexOf(".") == -1) {
            throw new RuntimeException("no file extension found.");
        }

        String extension = fileName.substring(fileName.lastIndexOf("."));

        return UUID.randomUUID() + extension;
    }
}
