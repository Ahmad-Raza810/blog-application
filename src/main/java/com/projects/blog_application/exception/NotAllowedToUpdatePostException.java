package com.projects.blog_application.exception;

public class NotAllowedToUpdatePostException extends RuntimeException {
  public NotAllowedToUpdatePostException(String message) {
    super(message);
  }
}
