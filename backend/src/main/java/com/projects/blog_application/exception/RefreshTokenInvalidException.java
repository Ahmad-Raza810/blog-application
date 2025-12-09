package com.projects.blog_application.exception;

public class RefreshTokenInvalidException extends RuntimeException {
  public RefreshTokenInvalidException(String message) {
    super(message);
  }
}
