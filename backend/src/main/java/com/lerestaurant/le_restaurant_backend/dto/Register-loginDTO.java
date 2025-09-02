package com.lerestaurant.le_restaurant_backend.dto;

import lombok.Data;


@Data
public class RegisterRequest {
    private String email;
    private String password;
}
package com.lerestaurant.le_restaurant_backend.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;
}