package com.lerestaurant.le_restaurant_backend.service;

import com.lerestaurant.le_restaurant_backend.dto.MenuItemCreateRequestDto;
import com.lerestaurant.le_restaurant_backend.dto.MenuItemDto;
import com.lerestaurant.le_restaurant_backend.dto.MenuItemUpdateRequestDto;
import com.lerestaurant.le_restaurant_backend.entity.MenuItem;
import com.lerestaurant.le_restaurant_backend.repository.MenuRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * MenuService — service implementation used by unit tests in MenuServiceTest.
 * Implements simple mappings between DTOs and entity and delegates persistence
 * to MenuRepository.
 */
@Service
public class MenuService {

    private final MenuRepository menuRepository;

    public MenuService(MenuRepository menuRepository) {
        this.menuRepository = menuRepository;
    }

    public MenuItemDto createMenuItem(MenuItemCreateRequestDto request) {
        // Check duplicate by name
        Optional<MenuItem> existing = menuRepository.findByName(request.getName());
        if (existing.isPresent()) {
            throw new IllegalArgumentException("Menu item with name already exists");
        }

        MenuItem entity = new MenuItem();
        entity.setName(request.getName());
        entity.setDescription(request.getDescription());
        entity.setPrice(request.getPrice() != null ? request.getPrice() : BigDecimal.ZERO);
        entity.setCategory(request.getCategory());
        entity.setAvailable(request.getAvailable());
        entity.setImageUrl(request.getImageUrl());

        MenuItem saved = menuRepository.save(entity);
        return mapToDto(saved);
    }

    public MenuItemDto findMenuItemById(Long id) {
        MenuItem item = menuRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Menu item not found"));
        return mapToDto(item);
    }

    public MenuItemDto updateMenuItem(Long id, MenuItemUpdateRequestDto request) {
        MenuItem item = menuRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Menu item not found"));

        // Apply updates if provided
        if (request.getName() != null) item.setName(request.getName());
        if (request.getDescription() != null) item.setDescription(request.getDescription());
        if (request.getPrice() != null) item.setPrice(request.getPrice());
        if (request.getCategory() != null) item.setCategory(request.getCategory());
        if (request.getAvailable() != null) item.setAvailable(request.getAvailable());
        if (request.getImageUrl() != null) item.setImageUrl(request.getImageUrl());

        MenuItem saved = menuRepository.save(item);
        return mapToDto(saved);
    }

    public void deleteMenuItem(Long id) {
        boolean exists = menuRepository.existsById(id);
        if (!exists) {
            throw new RuntimeException("Menu item not found");
        }
        menuRepository.deleteById(id);
    }

    public List<MenuItemDto> findByCategory(String category) {
        List<MenuItem> items = menuRepository.findByCategory(category);
        return items.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public List<MenuItemDto> searchByName(String name) {
        List<MenuItem> items = menuRepository.findByNameContainingIgnoreCase(name);
        return items.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public List<MenuItemDto> findByAvailability(boolean available) {
        List<MenuItem> items = menuRepository.findByAvailable(available);
        return items.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public List<MenuItemDto> findAllMenuItems() {
        List<MenuItem> items = menuRepository.findAll();
        return items.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public List<String> getAllCategories() {
        return menuRepository.findDistinctCategories();
    }

    // --- simple mapper (keeps service self-contained for unit tests) ---
    private MenuItemDto mapToDto(MenuItem entity) {
        if (entity == null) return null;
        MenuItemDto dto = new MenuItemDto();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setDescription(entity.getDescription());
        dto.setPrice(entity.getPrice());
        dto.setCategory(entity.getCategory());
        dto.setAvailable(entity.isAvailable());
        dto.setImageUrl(entity.getImageUrl());
        return dto;
    }
}
