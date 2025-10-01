package com.lerestaurant.le_restaurant_backend.service;

import com.lerestaurant.le_restaurant_backend.dto.MenuItemDto;
import com.lerestaurant.le_restaurant_backend.dto.MenuItemCreateRequestDto;
import com.lerestaurant.le_restaurant_backend.dto.MenuItemUpdateRequestDto;
import com.lerestaurant.le_restaurant_backend.entity.MenuItem;
import com.lerestaurant.le_restaurant_backend.repository.MenuRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service layer for Menu Management (F103, F104)
 * Handles business logic for menu operations
 * 
 * @author Le Restaurant Development Team
 */
@Service
@Transactional
public class MenuService {
    
    private final MenuRepository menuRepository;
    
    @Autowired
    public MenuService(MenuRepository menuRepository) {
        this.menuRepository = menuRepository;
    }

    
    /**
     * Get all menu items (F103)
     * @return List of all menu items
     */
    public List<MenuItemDto> findAllMenuItems() {
        return menuRepository.findAll().stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }
    
    /**
     * Get menu item by ID (F103)
     * @param id Menu item ID
     * @return Menu item DTO
     * @throws RuntimeException if menu item not found
     */
    public MenuItemDto findMenuItemById(Long id) {
        MenuItem item = menuRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Menu item not found with id: " + id));
        return convertToDto(item);
    }
    
    /**
     * Create new menu item (F104) **CRITICAL**
     * @param request Create request DTO
     * @return Created menu item DTO
     * @throws IllegalArgumentException if menu item name already exists
     */
    public MenuItemDto createMenuItem(MenuItemCreateRequestDto request) {
        // Check for duplicate name
        if (menuRepository.findByName(request.getName()).isPresent()) {
            throw new IllegalArgumentException("Menu item with name already exists: " + request.getName());
        }
        
        MenuItem item = new MenuItem();
        item.setName(request.getName());
        item.setDescription(request.getDescription());
        item.setPrice(request.getPrice());
        item.setCategory(request.getCategory());
        item.setAvailable(request.getAvailable() != null ? request.getAvailable() : true);
        item.setImageUrl(request.getImageUrl());
        item.setCreatedAt(OffsetDateTime.now());
        item.setUpdatedAt(OffsetDateTime.now());
        
        MenuItem savedItem = menuRepository.save(item);
        return convertToDto(savedItem);
    }
    
    /**
     * Update menu item (F104)
     * @param id Menu item ID
     * @param request Update request DTO
     * @return Updated menu item DTO
     * @throws RuntimeException if menu item not found
     */
    public MenuItemDto updateMenuItem(Long id, MenuItemUpdateRequestDto request) {
        MenuItem item = menuRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Menu item not found with id: " + id));
        
        if (request.getName() != null) {
            item.setName(request.getName());
        }
        if (request.getDescription() != null) {
            item.setDescription(request.getDescription());
        }
        if (request.getPrice() != null) {
            item.setPrice(request.getPrice());
        }
        if (request.getCategory() != null) {
            item.setCategory(request.getCategory());
        }
        if (request.getAvailable() != null) {
            item.setAvailable(request.getAvailable());
        }
        if (request.getImageUrl() != null) {
            item.setImageUrl(request.getImageUrl());
        }
        
        item.setUpdatedAt(OffsetDateTime.now());
        
        MenuItem updatedItem = menuRepository.save(item);
        return convertToDto(updatedItem);
    }
    
    /**
     * Delete menu item (F104)
     * @param id Menu item ID
     * @throws RuntimeException if menu item not found
     */
    public void deleteMenuItem(Long id) {
        if (!menuRepository.existsById(id)) {
            throw new RuntimeException("Menu item not found with id: " + id);
        }
        menuRepository.deleteById(id);
    }
    
    /**
     * Search menu items by name (F103)
     * @param name Search term
     * @return List of matching menu items
     */
    public List<MenuItemDto> searchByName(String name) {
        return menuRepository.findByNameContainingIgnoreCase(name).stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }
    
    /**
     * Find menu items by category (F103)
     * @param category Category name
     * @return List of menu items in category
     */
    public List<MenuItemDto> findByCategory(String category) {
        return menuRepository.findByCategory(category).stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }
    
    /**
     * Find menu items by availability (F103)
     * @param available Availability status
     * @return List of menu items with matching availability
     */
    public List<MenuItemDto> findByAvailability(boolean available) {
        return menuRepository.findByAvailable(available).stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }
    
    /**
     * Get all unique categories (F103)
     * @return List of category names
     */
    public List<String> getAllCategories() {
        return menuRepository.findDistinctCategories();
    }
    
    /**
     * Convert MenuItem entity to DTO
     * @param item MenuItem entity
     * @return MenuItemDto
     */
    private MenuItemDto convertToDto(MenuItem item) {
        MenuItemDto dto = new MenuItemDto();
        dto.setId(item.getId());
        dto.setName(item.getName());
        dto.setDescription(item.getDescription());
        dto.setPrice(item.getPrice());
        dto.setCategory(item.getCategory());
        dto.setAvailable(item.isAvailable());
        dto.setImageUrl(item.getImageUrl());
        dto.setCreatedAt(item.getCreatedAt());
        dto.setUpdatedAt(item.getUpdatedAt());
        return dto;
    }
}
