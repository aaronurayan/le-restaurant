package com.lerestaurant.le_restaurant_backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.OffsetDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Global Exception Handler
 * 
 * Handles validation errors and other exceptions globally.
 * 
 * @author Le Restaurant Development Team
 * @version 1.0.0
 * @since 2025-01-27
 */
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    /**
     * Handle validation errors from @Valid annotations
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationExceptions(
            MethodArgumentNotValidException ex) {
        Map<String, Object> errors = new HashMap<>();
        Map<String, String> fieldErrors = new HashMap<>();
        
        ex.getBindingResult().getFieldErrors().forEach(error -> {
            fieldErrors.put(error.getField(), error.getDefaultMessage());
        });
        
        errors.put("error", "Validation failed");
        errors.put("fieldErrors", fieldErrors);
        errors.put("timestamp", OffsetDateTime.now().toString());
        
        return ResponseEntity.badRequest().body(errors);
    }
    
    /**
     * Handle IllegalArgumentException
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalArgumentException(
            IllegalArgumentException ex) {
        Map<String, Object> error = new HashMap<>();
        error.put("error", ex.getMessage());
        error.put("timestamp", OffsetDateTime.now().toString());
        return ResponseEntity.badRequest().body(error);
    }
    
    /**
     * Handle IllegalStateException
     */
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalStateException(
            IllegalStateException ex) {
        Map<String, Object> error = new HashMap<>();
        error.put("error", ex.getMessage());
        error.put("timestamp", OffsetDateTime.now().toString());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
    }
    
    /**
     * Handle RuntimeException (generic runtime exceptions)
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntimeException(
            RuntimeException ex) {
        Map<String, Object> error = new HashMap<>();
        error.put("error", ex.getMessage());
        error.put("timestamp", OffsetDateTime.now().toString());
        
        // Determine appropriate HTTP status based on error message
        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
        String message = ex.getMessage();
        
        if (message != null) {
            if (message.contains("not found")) {
                status = HttpStatus.NOT_FOUND;
            } else if (message.contains("already exists") || message.contains("duplicate")) {
                status = HttpStatus.CONFLICT;
            } else if (message.contains("invalid") || message.contains("required")) {
                status = HttpStatus.BAD_REQUEST;
            }
        }
        
        return ResponseEntity.status(status).body(error);
    }
}

