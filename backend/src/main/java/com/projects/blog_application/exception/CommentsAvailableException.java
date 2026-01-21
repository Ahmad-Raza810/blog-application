package com.projects.blog_application.exception;

public class CommentsAvailableException extends RuntimeException {
    public CommentsAvailableException(String message) {
        super(message);
    }
}
