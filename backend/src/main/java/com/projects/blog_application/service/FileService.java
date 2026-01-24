package com.projects.blog_application.service;


import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

public interface FileService {
    public String saveImage(MultipartFile file);

    public String getImage();

    public void deleteImage(UUID postId);

}
