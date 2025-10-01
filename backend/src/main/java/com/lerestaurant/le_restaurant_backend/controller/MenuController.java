package com.lerestaurant.le_restaurant_backend.controller;

import com.lerestaurant.le_restaurant_backend.dto.MenuItemDto;
import com.lerestaurant.le_restaurant_backend.service.MenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/menu")
@CrossOrigin(origins = "http://localhost:5173")
public class MenuController {
    private final MenuService menuService;

    @Autowired
    public MenuController(MenuService menuService) {
        this.menuService = menuService;
    }

    @GetMapping("/items")
    public List<MenuItemDto> getAllMenuItems() {
        return menuService.getAllMenuItems();
    }

    @GetMapping("/items/{id}")
    public ResponseEntity<MenuItemDto> getMenuItemById(@PathVariable Long id) {
        try {
            MenuItemDto menuItem = menuService.getMenuItemById(id);
            return ResponseEntity.ok(menuItem);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/categories")
    public ResponseEntity<List<String>> getAllCategories() {
        List<String> categories = menuService.getAllCategories();
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/items/category/{category}")
    public ResponseEntity<List<MenuItemDto>> getMenuItemsByCategory(@PathVariable String category) {
        List<MenuItemDto> menuItems = menuService.getMenuItemsByCategory(category);
        return ResponseEntity.ok(menuItems);
    }

    @GetMapping("/search")
    public ResponseEntity<List<MenuItemDto>> searchMenuItems(@RequestParam String keyword) {
        List<MenuItemDto> menuItems = menuService.searchMenuItems(keyword);
        return ResponseEntity.ok(menuItems);
    }

    @GetMapping("/test")
    public ResponseEntity<Map<String, String>> testConnection() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Backend connection successful! 🎉");
        response.put("status", "success");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/items")
    public ResponseEntity<MenuItemDto> createMenuItem(@RequestBody MenuItemDto menuItemDto) {
        MenuItemDto created = menuService.createMenuItem(menuItemDto);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/items/{id}")
    public ResponseEntity<MenuItemDto> updateMenuItem(@PathVariable Long id, @RequestBody MenuItemDto menuItemDto) {
        MenuItemDto updated = menuService.updateMenuItem(id, menuItemDto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/items/{id}")
    public ResponseEntity<Void> deleteMenuItem(@PathVariable Long id) {
        menuService.deleteMenuItem(id);
        return ResponseEntity.noContent().build();
    }
}
