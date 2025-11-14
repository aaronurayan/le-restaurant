package com.lerestaurant.le_restaurant_backend.controller;

import com.lerestaurant.le_restaurant_backend.dto.MenuItemDto;
import com.lerestaurant.le_restaurant_backend.dto.MenuItemCreateRequestDto;
import com.lerestaurant.le_restaurant_backend.dto.MenuItemUpdateRequestDto;
import com.lerestaurant.le_restaurant_backend.service.MenuService;
import jakarta.validation.Valid;
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
// CORS is handled globally in WebConfig
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
        // Exception handling is done by GlobalExceptionHandler
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
    }
    
    /**
     * GET MENU ITEM BY ID (F103 - Public)
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getMenuItemById(@PathVariable Long id) {
        // Exception handling is done by GlobalExceptionHandler
        MenuItemDto item = menuService.findMenuItemById(id);
        return ResponseEntity.ok(item);
    }
    
    /**
     * CREATE MENU ITEM (F104 - Manager only) **CRITICAL**
     */
    @PostMapping
    public ResponseEntity<?> createMenuItem(@Valid @RequestBody MenuItemCreateRequestDto request) {
        // Exception handling is done by GlobalExceptionHandler
        MenuItemDto createdItem = menuService.createMenuItem(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdItem);
    }
    
    /**
     * UPDATE MENU ITEM (F104 - Manager only)
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateMenuItem(
            @PathVariable Long id,
            @Valid @RequestBody MenuItemUpdateRequestDto request
    ) {
        // Exception handling is done by GlobalExceptionHandler
        MenuItemDto updatedItem = menuService.updateMenuItem(id, request);
        return ResponseEntity.ok(updatedItem);
    }
    
    /**
     * DELETE MENU ITEM (F104 - Manager only)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMenuItem(@PathVariable Long id) {
        // Exception handling is done by GlobalExceptionHandler
        menuService.deleteMenuItem(id);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * GET CATEGORIES (F103 - Public)
     */
    @GetMapping("/categories")
    public ResponseEntity<List<String>> getAllCategories() {
        // Exception handling is done by GlobalExceptionHandler
        List<String> categories = menuService.getAllCategories();
        return ResponseEntity.ok(categories);
    }
}
