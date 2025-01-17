package com.blogapp.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

public class ResourceNotFoundException extends RuntimeException{
    @Getter
    private HttpStatus status;

    private String message;

    public ResourceNotFoundException(String message, HttpStatus status) {
        super(message);
        this.status = status;
        this.message = message;
    }
}
