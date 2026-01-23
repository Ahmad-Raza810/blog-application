package com.projects.blog_application.service.Impl;

import com.projects.blog_application.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Set;
import java.util.UUID;

@Service
public class FileServiceImpl implements FileService {

    private final Path root;
    private static final Set<String> allowedType =
            Set.of("image/jpg", "image/jpeg", "image/png");

    public FileServiceImpl(@Value("${file.upload.dir}") Path uploadPath) {
        this.root = uploadPath.toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.root);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize upload directory", e);
        }
    }

    @Override
    public String saveImage(MultipartFile file) {
        validateImage(file);
        String fileName = validateImageName(file);

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

    private void validateImage(MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new RuntimeException("file not valid.");
        }

        if (file.getSize() > 2 * 1024 * 1024) {
            throw new RuntimeException("file size exceeds.");
        }

        String contentType = file.getContentType();
        if (contentType == null || !allowedType.contains(contentType.toLowerCase())) {
            throw new RuntimeException("file type is not supported");
        }

    }

    private String validateImageName(MultipartFile file) {
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
