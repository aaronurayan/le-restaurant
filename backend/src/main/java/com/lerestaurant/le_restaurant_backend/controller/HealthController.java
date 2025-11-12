package com.lerestaurant.le_restaurant_backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * HealthController
 * Simple health check endpoint for frontend to verify backend connectivity
 * 
 * @author Le Restaurant Development Team
 */
@RestController
@RequestMapping("/api")
// CORS is handled globally in WebConfig
public class HealthController {

    /**
     * Health check endpoint
     * GET /api/health
     * 
     * @return Health status
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "Le Restaurant Backend");
        response.put("timestamp", System.currentTimeMillis());
        
        return ResponseEntity.ok(response);
    }
}
