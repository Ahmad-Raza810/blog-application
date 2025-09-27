package com.projects.blog_application.exception;


import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;


@ControllerAdvice
@RequiredArgsConstructor
public class ErrorController {


    //handler for resource not found exception
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiErrorResponse>  handlerResourceNotFound(ResourceNotFoundException exception){
        ApiErrorResponse errorResponse=ApiErrorResponse.builder()
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .message(exception.getMessage())
                .build();

        return new ResponseEntity<>(errorResponse,HttpStatus.INTERNAL_SERVER_ERROR);
    }

    //handler validation exception
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse>  handlerValidation(MethodArgumentNotValidException exception){

       List<ApiErrorResponse.FieldError> errors=exception.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(fieldError ->new ApiErrorResponse
                                .FieldError(fieldError.getDefaultMessage(),
                                fieldError.getField())).toList();

        ApiErrorResponse errorResponse=ApiErrorResponse.builder()
                .message("Validation error.")
                .errors(errors)
                .status(HttpStatus.BAD_REQUEST.value())
                .build();

        return new ResponseEntity<>(errorResponse,HttpStatus.BAD_REQUEST);
    }


    //handler for any other exception
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse>  generalHandler(Exception exception){
        ApiErrorResponse errorResponse=ApiErrorResponse.builder()
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .message("Something went wrong.")
                .build();

        return new ResponseEntity<>(errorResponse,HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
