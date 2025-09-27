package com.projects.blog_application.exception;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApiErrorResponse {

    private String message;
    private int status;
    private List<FieldError> errors;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FieldError{
        private String message;
        private String field;
    }
}
