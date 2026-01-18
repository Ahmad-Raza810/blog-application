package com.projects.blog_application.service;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
    String storePostCover(MultipartFile file);
    void deleteIfExists(String storedUrlOrPath);
}

