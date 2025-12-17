package com.lerestaurant.le_restaurant_backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Exception for business logic violations (422 Unprocessable Entity)
 */
@ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY)
public class BusinessLogicException extends RuntimeException {

    public BusinessLogicException(String message) {
        super(message);
    }

    public BusinessLogicException(String message, Throwable cause) {
        super(message, cause);
    }
}
