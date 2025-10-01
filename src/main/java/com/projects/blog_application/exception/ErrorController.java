package com.projects.blog_application.exception;


import com.projects.blog_application.response.ApiErrorResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;


@ControllerAdvice
@RequiredArgsConstructor
@Slf4j
public class ErrorController {





    //handler for PostAvailableException
    @ExceptionHandler(PostAvailableException.class)
    public ResponseEntity<ApiErrorResponse> handlePostAvailable(PostAvailableException ex) {
        ApiErrorResponse errorResponse=ApiErrorResponse.builder()
                .message(ex.getMessage())
                .status(HttpStatus.BAD_REQUEST.value())
                .build();

        return new ResponseEntity<>(errorResponse,HttpStatus.BAD_REQUEST);
    }


    //handler for resource not found exception
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiErrorResponse>  handlerResourceNotFound(ResourceNotFoundException exception){
        log.error("Exception caught {}", String.valueOf(exception));
        ApiErrorResponse errorResponse=ApiErrorResponse.builder()
                .status(HttpStatus.NO_CONTENT.value())
                .message(exception.getMessage())
                .build();

        return new ResponseEntity<>(errorResponse,HttpStatus.NO_CONTENT);
    }


    //handler validation exception
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse>  handlerValidation(MethodArgumentNotValidException exception){
        Map<String,String> errors=new HashMap<>();
        exception.getBindingResult()
                .getFieldErrors()
                .forEach(error->errors.put(error.getField(),error.getDefaultMessage()));
        ApiErrorResponse errorResponse=ApiErrorResponse.builder()
                .message("Validation error.")
                .errors(errors)
                .status(HttpStatus.BAD_REQUEST.value())
                .build();

        return new ResponseEntity<>(errorResponse,HttpStatus.BAD_REQUEST);
    }



    // Handle BadCredentialsException
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiErrorResponse> handleBadCredentials(
            BadCredentialsException ex) {
        ApiErrorResponse errorResponse=ApiErrorResponse.builder()
                .message("Invalid email or password.")
                .status(HttpStatus.UNAUTHORIZED.value())
                .build();

        return new ResponseEntity<>(errorResponse,HttpStatus.UNAUTHORIZED);
    }


    // Handle malformed JSON or mapping issues
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiErrorResponse> handleInvalidJson(HttpMessageNotReadableException ex) {
        ApiErrorResponse errorResponse = ApiErrorResponse.builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .message("Invalid JSON request")
                .build();

        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
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
