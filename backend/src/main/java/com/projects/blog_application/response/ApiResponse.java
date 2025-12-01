package com.projects.blog_application.response;

import lombok.*;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ApiResponse <T>{
    private String message;
    private T data;
    private int status;
    private boolean success;
    private LocalDateTime dateTime;
}
