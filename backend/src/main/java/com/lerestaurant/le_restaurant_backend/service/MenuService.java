package com.lerestaurant.le_restaurant_backend.service;
import com.lerestaurant.le_restaurant_backend.dto.MenuItemDto;
import com.lerestaurant.le_restaurant_backend.entity.MenuItem;
import com.lerestaurant.le_restaurant_backend.repository.MenuItemRepository;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MenuService {

   @Autowired
    private MenuItemRepository menuItemRepository;

    public List<MenuItemDto> getAllMenuItems() {
        return menuItemRepository.findAll().stream()
            .map(this::toDto)
            .collect(Collectors.toList());
    }
    public List<String> getAllCategories() {
        return menuItemRepository.findAll().stream()
            .map(MenuItem::getCategory)
            .distinct()
            .collect(Collectors.toList());
    }
    public MenuItemDto getMenuItemById(Long id) {
        MenuItem item = menuItemRepository.findById(id).orElseThrow();
        return toDto(item);
    }
    public List<MenuItemDto> getMenuItemsByCategory(String category) {
        return menuItemRepository.findAll().stream()
            .filter(item -> item.getCategory().equalsIgnoreCase(category))
            .map(this::toDto)
            .collect(Collectors.toList());
    }
    
    public List<MenuItemDto> searchMenuItems(String keyword) {
        String lowerKeyword = keyword.toLowerCase();
        return menuItemRepository.findAll().stream()
            .filter(item -> item.getName().toLowerCase().contains(lowerKeyword) ||
                            item.getDescription().toLowerCase().contains(lowerKeyword))
            .map(this::toDto)
            .collect(Collectors.toList());
    }
    public MenuItemDto createMenuItem(MenuItemDto menuItemDto) {
        MenuItem item = toEntity(menuItemDto);
        MenuItem saved = menuItemRepository.save(item);
        return toDto(saved);
    }

    public MenuItemDto updateMenuItem(Long id, MenuItemDto menuItemDto) {
        MenuItem item = menuItemRepository.findById(id).orElseThrow();
        item.setName(menuItemDto.getName());
        item.setDescription(menuItemDto.getDescription());
        item.setPrice(menuItemDto.getPrice());
        item.setCategory(menuItemDto.getCategory());
        item.setImageUrl(menuItemDto.getImageUrl());
        item.setAvailable(menuItemDto.isAvailable());
        MenuItem updated = menuItemRepository.save(item);
        return toDto(updated);
    }

    public void deleteMenuItem(Long id) {
        menuItemRepository.deleteById(id);
    }

    // Helper methods to convert between entity and DTO
    private MenuItemDto toDto(MenuItem item) {
        return new MenuItemDto(
            item.getId(),
            item.getName(),
            item.getDescription(),
            item.getPrice(),
            item.getCategory(),
            item.getImageUrl(),
            item.isAvailable()
        );
    }

    private MenuItem toEntity(MenuItemDto dto) {
    MenuItem item = new MenuItem();
    item.setName(dto.getName());
    item.setDescription(dto.getDescription());
    item.setPrice(dto.getPrice());
    item.setCategory(dto.getCategory());
    item.setImageUrl(dto.getImageUrl());
    item.setAvailable(dto.isAvailable());
    return item;
}
}
