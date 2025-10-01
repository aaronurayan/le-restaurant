package com.lerestaurant.le_restaurant_backend.controller;

import com.lerestaurant.le_restaurant_backend.dto.MenuItemDto;
import com.lerestaurant.le_restaurant_backend.dto.MenuItemCreateRequestDto;
import com.lerestaurant.le_restaurant_backend.dto.MenuItemUpdateRequestDto;
import com.lerestaurant.le_restaurant_backend.service.MenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST Controller for Menu Management (F103, F104)
 * Handles HTTP requests for menu operations
 * 
 * @author Le Restaurant Development Team
 */
@RestController
@RequestMapping("/api/menu-items")
@CrossOrigin(origins = "http://localhost:5173")
public class MenuController {
    
    private final MenuService menuService;
    
    @Autowired
    public MenuController(MenuService menuService) {
        this.menuService = menuService;
    }

    
    /**
     * GET ALL MENU ITEMS (F103 - Public)
     * Supports filtering by category, search, and availability
     */
    @GetMapping
    public ResponseEntity<List<MenuItemDto>> getAllMenuItems(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Boolean available
    ) {
        try {
            List<MenuItemDto> items;
            
            if (category != null && !category.isEmpty()) {
                items = menuService.findByCategory(category);
            } else if (search != null && !search.isEmpty()) {
                items = menuService.searchByName(search);
            } else if (available != null) {
                items = menuService.findByAvailability(available);
            } else {
                items = menuService.findAllMenuItems();
            }
            
            return ResponseEntity.ok(items);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    
    /**
     * GET MENU ITEM BY ID (F103 - Public)
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getMenuItemById(@PathVariable Long id) {
        try {
            MenuItemDto item = menuService.findMenuItemById(id);
            return ResponseEntity.ok(item);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "Menu item not found with id: " + id));
        }
    }
    
    /**
     * CREATE MENU ITEM (F104 - Manager only) **CRITICAL**
     */
    @PostMapping
    public ResponseEntity<?> createMenuItem(@RequestBody MenuItemCreateRequestDto request) {
        try {
            // Validate required fields
            if (request.getName() == null || request.getName().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Menu item name is required"));
            }
            
            if (request.getPrice() == null || request.getPrice().doubleValue() <= 0) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Menu item price must be greater than 0"));
            }
            
            if (request.getCategory() == null || request.getCategory().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Menu item category is required"));
            }
            
            MenuItemDto createdItem = menuService.createMenuItem(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdItem);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * UPDATE MENU ITEM (F104 - Manager only)
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateMenuItem(
            @PathVariable Long id,
            @RequestBody MenuItemUpdateRequestDto request
    ) {
        try {
            MenuItemDto updatedItem = menuService.updateMenuItem(id, request);
            return ResponseEntity.ok(updatedItem);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "Menu item not found with id: " + id));
        }
    }
    
    /**
     * DELETE MENU ITEM (F104 - Manager only)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMenuItem(@PathVariable Long id) {
        try {
            menuService.deleteMenuItem(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "Menu item not found with id: " + id));
        }
    }
    
    /**
     * GET CATEGORIES (F103 - Public)
     */
    @GetMapping("/categories")
    public ResponseEntity<List<String>> getAllCategories() {
        try {
            List<String> categories = menuService.getAllCategories();
            return ResponseEntity.ok(categories);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
