package com.projects.blog_application.exception;

public class NotAllowedOperationException extends RuntimeException {
    public NotAllowedOperationException(String message) {
        super(message);
    }
}
