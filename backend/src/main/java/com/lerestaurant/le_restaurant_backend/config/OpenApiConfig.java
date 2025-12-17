package com.lerestaurant.le_restaurant_backend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * OpenAPI/Swagger Configuration
 * 
 * Provides API documentation at /swagger-ui/index.html
 * 
 * @author Le Restaurant Development Team
 * @version 1.0.0
 */
@Configuration
public class OpenApiConfig {

    @Value("${server.port:8080}")
    private String serverPort;

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Le Restaurant API")
                        .version("1.0.0")
                        .description(
                                "Restaurant Management System API - Full-stack restaurant management with order, payment, delivery, and reservation features.")
                        .contact(new Contact()
                                .name("Le Restaurant Development Team")
                                .email("team@lerestaurant.com"))
                        .license(new License()
                                .name("Academic Use Only")
                                .url("https://github.com/aaronurayan/le-restaurant")))
                .servers(List.of(
                        new Server().url("http://localhost:" + serverPort).description("Local Development"),
                        new Server().url("https://le-restaurant-adbrdddye6cbdjf2.australiaeast-01.azurewebsites.net")
                                .description("Azure Production")));
    }
}
