package com.lerestaurant.le_restaurant_backend.service;

import com.lerestaurant.le_restaurant_backend.dto.MenuItemCreateRequestDto;
import com.lerestaurant.le_restaurant_backend.dto.MenuItemDto;
import com.lerestaurant.le_restaurant_backend.dto.MenuItemUpdateRequestDto;
import com.lerestaurant.le_restaurant_backend.entity.MenuItem;
import com.lerestaurant.le_restaurant_backend.repository.MenuRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

/**
 * Unit Tests for MenuService (F103, F104)
 * 
 * This test suite validates the business logic for menu management operations
 * including menu item creation, updates, deletion, search, and filtering.
 * 
 * @author Le Restaurant Development Team
 * @module F103-MenuDisplay, F104-MenuManagement
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("MenuService Tests (F103/F104)")
class MenuServiceTest {
    
    @Mock
    private MenuRepository menuRepository;
    
    @InjectMocks
    private MenuService menuService;
    
    private MenuItem testMenuItem;
    private MenuItemCreateRequestDto createRequest;
    
    @BeforeEach
    void setUp() {
        testMenuItem = new MenuItem();
        testMenuItem.setId(1L);
        testMenuItem.setName("Caesar Salad");
        testMenuItem.setDescription("Fresh romaine lettuce with caesar dressing");
        testMenuItem.setPrice(new BigDecimal("12.99"));
        testMenuItem.setCategory("STARTER");
        testMenuItem.setAvailable(true);
        testMenuItem.setImageUrl("caesar-salad.jpg");
        
        createRequest = new MenuItemCreateRequestDto();
        createRequest.setName("New Item");
        createRequest.setDescription("New Description");
        createRequest.setPrice(new BigDecimal("15.99"));
        createRequest.setCategory("MAIN");
        createRequest.setAvailable(true);
    }
    
    @Test
    @DisplayName("Test 1: Should create menu item successfully")
    void shouldCreateMenuItemSuccessfully() {
        // Given
        when(menuRepository.findByName(anyString())).thenReturn(Optional.empty());
        when(menuRepository.save(any(MenuItem.class))).thenReturn(testMenuItem);
        
        // When
        MenuItemDto result = menuService.createMenuItem(createRequest);
        
        // Then
        assertThat(result).isNotNull();
        assertThat(result.getName()).isEqualTo(testMenuItem.getName());
        assertThat(result.getPrice()).isEqualTo(testMenuItem.getPrice());
        assertThat(result.getCategory()).isEqualTo(testMenuItem.getCategory());
        verify(menuRepository).findByName(anyString());
        verify(menuRepository).save(any(MenuItem.class));
    }
    
    @Test
    @DisplayName("Test 2: Should throw exception when creating duplicate menu item")
    void shouldThrowExceptionWhenCreatingDuplicate() {
        // Given
        when(menuRepository.findByName(anyString())).thenReturn(Optional.of(testMenuItem));
        
        // When/Then
        assertThatThrownBy(() -> menuService.createMenuItem(createRequest))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("Menu item with name already exists");
        
        verify(menuRepository).findByName(anyString());
        verify(menuRepository, never()).save(any(MenuItem.class));
    }
    
    @Test
    @DisplayName("Test 3: Should find menu item by ID")
    void shouldFindMenuItemById() {
        // Given
        when(menuRepository.findById(1L)).thenReturn(Optional.of(testMenuItem));
        
        // When
        MenuItemDto result = menuService.findMenuItemById(1L);
        
        // Then
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getName()).isEqualTo("Caesar Salad");
        assertThat(result.getPrice()).isEqualByComparingTo(new BigDecimal("12.99"));
        verify(menuRepository).findById(1L);
    }
    
    @Test
    @DisplayName("Test 4: Should throw exception when menu item not found")
    void shouldThrowExceptionWhenMenuItemNotFound() {
        // Given
        when(menuRepository.findById(999L)).thenReturn(Optional.empty());
        
        // When/Then
        assertThatThrownBy(() -> menuService.findMenuItemById(999L))
            .isInstanceOf(RuntimeException.class)
            .hasMessageContaining("Menu item not found");
        
        verify(menuRepository).findById(999L);
    }
    
    @Test
    @DisplayName("Test 5: Should update menu item successfully")
    void shouldUpdateMenuItemSuccessfully() {
        // Given
        MenuItemUpdateRequestDto updateRequest = new MenuItemUpdateRequestDto();
        updateRequest.setName("Updated Caesar Salad");
        updateRequest.setPrice(new BigDecimal("19.99"));
        updateRequest.setAvailable(false);
        
        when(menuRepository.findById(1L)).thenReturn(Optional.of(testMenuItem));
        when(menuRepository.save(any(MenuItem.class))).thenReturn(testMenuItem);
        
        // When
        MenuItemDto result = menuService.updateMenuItem(1L, updateRequest);
        
        // Then
        assertThat(result).isNotNull();
        verify(menuRepository).findById(1L);
        verify(menuRepository).save(any(MenuItem.class));
    }
    
    @Test
    @DisplayName("Test 6: Should delete menu item successfully")
    void shouldDeleteMenuItemSuccessfully() {
        // Given
        when(menuRepository.existsById(1L)).thenReturn(true);
        doNothing().when(menuRepository).deleteById(1L);
        
        // When/Then
        assertThatCode(() -> menuService.deleteMenuItem(1L))
            .doesNotThrowAnyException();
        
        verify(menuRepository).existsById(1L);
        verify(menuRepository).deleteById(1L);
    }
    
    @Test
    @DisplayName("Test 7: Should throw exception when deleting non-existent menu item")
    void shouldThrowExceptionWhenDeletingNonExistent() {
        // Given
        when(menuRepository.existsById(999L)).thenReturn(false);
        
        // When/Then
        assertThatThrownBy(() -> menuService.deleteMenuItem(999L))
            .isInstanceOf(RuntimeException.class)
            .hasMessageContaining("Menu item not found");
        
        verify(menuRepository).existsById(999L);
        verify(menuRepository, never()).deleteById(999L);
    }
    
    @Test
    @DisplayName("Test 8: Should find menu items by category")
    void shouldFindMenuItemsByCategory() {
        // Given
        MenuItem item2 = new MenuItem();
        item2.setId(2L);
        item2.setName("Garden Salad");
        item2.setCategory("STARTER");
        
        List<MenuItem> items = Arrays.asList(testMenuItem, item2);
        when(menuRepository.findByCategory("STARTER")).thenReturn(items);
        
        // When
        List<MenuItemDto> result = menuService.findByCategory("STARTER");
        
        // Then
        assertThat(result).hasSize(2);
        assertThat(result.get(0).getCategory()).isEqualTo("STARTER");
        assertThat(result.get(1).getCategory()).isEqualTo("STARTER");
        verify(menuRepository).findByCategory("STARTER");
    }
    
    @Test
    @DisplayName("Test 9: Should search menu items by name")
    void shouldSearchMenuItemsByName() {
        // Given
        List<MenuItem> items = Arrays.asList(testMenuItem);
        when(menuRepository.findByNameContainingIgnoreCase("caesar")).thenReturn(items);
        
        // When
        List<MenuItemDto> result = menuService.searchByName("caesar");
        
        // Then
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getName()).containsIgnoringCase("caesar");
        verify(menuRepository).findByNameContainingIgnoreCase("caesar");
    }
    
    @Test
    @DisplayName("Test 10: Should find available menu items only")
    void shouldFindAvailableMenuItemsOnly() {
        // Given
        MenuItem availableItem = new MenuItem();
        availableItem.setId(2L);
        availableItem.setName("Available Item");
        availableItem.setAvailable(true);
        
        List<MenuItem> items = Arrays.asList(testMenuItem, availableItem);
        when(menuRepository.findByAvailable(true)).thenReturn(items);
        
        // When
        List<MenuItemDto> result = menuService.findByAvailability(true);
        
        // Then
        assertThat(result).hasSize(2);
        assertThat(result).allMatch(dto -> dto.isAvailable());
        verify(menuRepository).findByAvailable(true);
    }
    
    @Test
    @DisplayName("Test 11: Should get all menu items")
    void shouldGetAllMenuItems() {
        // Given
        MenuItem item2 = new MenuItem();
        item2.setId(2L);
        item2.setName("Margherita Pizza");
        item2.setCategory("MAIN");
        
        List<MenuItem> items = Arrays.asList(testMenuItem, item2);
        when(menuRepository.findAll()).thenReturn(items);
        
        // When
        List<MenuItemDto> result = menuService.findAllMenuItems();
        
        // Then
        assertThat(result).hasSize(2);
        verify(menuRepository).findAll();
    }
    
    @Test
    @DisplayName("Test 12: Should get all categories")
    void shouldGetAllCategories() {
        // Given
        List<String> categories = Arrays.asList("STARTER", "MAIN", "DESSERT", "BEVERAGE");
        when(menuRepository.findDistinctCategories()).thenReturn(categories);
        
        // When
        List<String> result = menuService.getAllCategories();
        
        // Then
        assertThat(result).hasSize(4);
        assertThat(result).containsExactlyInAnyOrder("STARTER", "MAIN", "DESSERT", "BEVERAGE");
        verify(menuRepository).findDistinctCategories();
    }
}
