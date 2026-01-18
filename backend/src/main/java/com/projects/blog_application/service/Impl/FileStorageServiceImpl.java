package com.projects.blog_application.service.Impl;

import com.projects.blog_application.service.FileStorageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.Set;
import java.util.UUID;

@Service
public class FileStorageServiceImpl implements FileStorageService {

    private static final long MAX_BYTES = 5L * 1024 * 1024; // 5MB
    private static final Set<String> ALLOWED_TYPES = Set.of(
            "image/jpeg", "image/png", "image/webp"
    );

    private final Path postCoversDir;

    @Value("${app.base-url:http://localhost:8080}")
    private String baseUrl;


    public FileStorageServiceImpl(@Value("${app.upload.dir:uploads}") String uploadDir) {
        this.postCoversDir = Paths.get(uploadDir).resolve("post-covers").toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.postCoversDir);
        } catch (IOException e) {
            throw new IllegalStateException("Could not create upload directory: " + this.postCoversDir, e);
        }
    }

    @Override
    public String storePostCover(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Cover image is required.");
        }

        if (file.getSize() > MAX_BYTES) {
            throw new IllegalArgumentException("Cover image must be <= 5MB.");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_TYPES.contains(contentType)) {
            throw new IllegalArgumentException("Only JPEG, PNG, and WEBP images are allowed.");
        }

        String originalName = StringUtils.cleanPath(file.getOriginalFilename() == null ? "" : file.getOriginalFilename());
        String ext = getExtension(originalName, contentType);

        String filename = UUID.randomUUID() + ext;
        Path target = postCoversDir.resolve(filename).normalize();

        // Safety: ensure no path traversal
        if (!target.startsWith(postCoversDir)) {
            throw new IllegalArgumentException("Invalid file path.");
        }

        try {
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new IllegalStateException("Failed to store cover image.", e);
        }

        // Public URL that StaticResourceConfig serves:
        return baseUrl + "/uploads/post-covers/" + filename;

    }

    @Override
    public void deleteIfExists(String storedUrlOrPath) {
        if (storedUrlOrPath == null || storedUrlOrPath.isBlank()) return;

        // We store URL like /uploads/post-covers/filename.ext
        String prefix = "/uploads/post-covers/";
        if (!storedUrlOrPath.startsWith(prefix)) return;

        String filename = storedUrlOrPath.substring(prefix.length());
        if (filename.isBlank()) return;

        Path target = postCoversDir.resolve(filename).normalize();
        if (!target.startsWith(postCoversDir)) return;

        try {
            Files.deleteIfExists(target);
        } catch (IOException ignored) {
            // best-effort delete
        }
    }

    private String getExtension(String originalName, String contentType) {
        // Prefer original extension if present
        int dot = originalName.lastIndexOf('.');
        if (dot >= 0 && dot < originalName.length() - 1) {
            String ext = originalName.substring(dot).toLowerCase();
            if (ext.equals(".jpg") || ext.equals(".jpeg") || ext.equals(".png") || ext.equals(".webp")) {
                return ext.equals(".jpg") ? ".jpeg" : ext;
            }
        }

        // Fallback to content type
        return switch (contentType) {
            case "image/jpeg" -> ".jpeg";
            case "image/png" -> ".png";
            case "image/webp" -> ".webp";
            default -> "";
        };
    }
}
