package com.projects.blog_application.service;


import org.springframework.web.multipart.MultipartFile;

public interface FileService {
    public String saveImage(MultipartFile file);

    public String getImage();

}
