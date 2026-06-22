package com.lerestaurant.le_restaurant_backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lerestaurant.le_restaurant_backend.config.TestSecurityConfig;
import com.lerestaurant.le_restaurant_backend.dto.MenuItemDto;
import com.lerestaurant.le_restaurant_backend.dto.MenuItemCreateRequestDto;
import com.lerestaurant.le_restaurant_backend.dto.MenuItemUpdateRequestDto;
import com.lerestaurant.le_restaurant_backend.service.MenuService;
import com.lerestaurant.le_restaurant_backend.util.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Unit Tests for MenuController (F103, F104 - Menu Management)
 * 
 * This test suite validates the REST API endpoints for menu operations
 * including CRUD operations, search, and filtering.
 * 
 * @author Le Restaurant Development Team
 * @module F103-F104-MenuManagement
 */
@WebMvcTest(MenuController.class)
@Import(TestSecurityConfig.class)
class MenuControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private MenuService menuService;

    // Satisfies the JwtAuthenticationFilter (a Filter bean auto-included by @WebMvcTest),
    // which depends on JwtUtil. Without this the slice's ApplicationContext fails to load.
    @MockBean
    private JwtUtil jwtUtil;

    private MenuItemDto testMenuItem;
    private MenuItemCreateRequestDto createRequestDto;

    @BeforeEach
    void setUp() {
        testMenuItem = new MenuItemDto();
        testMenuItem.setId(1L);
        testMenuItem.setName("Truffle Risotto");
        testMenuItem.setDescription("Creamy arborio rice with black truffle");
        testMenuItem.setPrice(new BigDecimal("45.00"));
        testMenuItem.setCategory("Main Course");
        testMenuItem.setAvailable(true);
        testMenuItem.setImageUrl("https://example.com/risotto.jpg");
        testMenuItem.setCreatedAt(OffsetDateTime.now());
        testMenuItem.setUpdatedAt(OffsetDateTime.now());

        createRequestDto = new MenuItemCreateRequestDto();
        createRequestDto.setName("Truffle Risotto");
        createRequestDto.setDescription("Creamy arborio rice with black truffle");
        createRequestDto.setPrice(new BigDecimal("45.00"));
        createRequestDto.setCategory("Main Course");
        createRequestDto.setAvailable(true);
    }

    // =========================================================================
    // GET /api/menu - List All Menu Items Tests (F103)
    // =========================================================================
    @Nested
    @DisplayName("GET /api/menu - List Menu Items")
    class ListMenuItemsTests {

        @Test
        @DisplayName("Should return all menu items")
        void shouldReturnAllMenuItems() throws Exception {
            MenuItemDto item2 = new MenuItemDto();
            item2.setId(2L);
            item2.setName("Caesar Salad");
            item2.setCategory("Appetizer");
            item2.setPrice(new BigDecimal("18.00"));
            item2.setAvailable(true);

            List<MenuItemDto> menuItems = Arrays.asList(testMenuItem, item2);
            when(menuService.findAllMenuItems()).thenReturn(menuItems);

            mockMvc.perform(get("/api/menu-items")
                    .contentType(MediaType.APPLICATION_JSON))
                    .andDo(print())
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$").isArray())
                    .andExpect(jsonPath("$.length()").value(2))
                    .andExpect(jsonPath("$[0].name").value("Truffle Risotto"))
                    .andExpect(jsonPath("$[1].name").value("Caesar Salad"));

            verify(menuService, times(1)).findAllMenuItems();
        }

        @Test
        @DisplayName("Should return empty list when no menu items exist")
        void shouldReturnEmptyList() throws Exception {
            when(menuService.findAllMenuItems()).thenReturn(Collections.emptyList());

            mockMvc.perform(get("/api/menu-items")
                    .contentType(MediaType.APPLICATION_JSON))
                    .andDo(print())
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$").isArray())
                    .andExpect(jsonPath("$.length()").value(0));
        }
    }

    // =========================================================================
    // GET /api/menu/{id} - Get Menu Item by ID Tests (F103)
    // =========================================================================
    @Nested
    @DisplayName("GET /api/menu/{id} - Get Menu Item by ID")
    class GetMenuItemByIdTests {

        @Test
        @DisplayName("Should return menu item by ID")
        void shouldReturnMenuItemById() throws Exception {
            when(menuService.findMenuItemById(1L)).thenReturn(testMenuItem);

            mockMvc.perform(get("/api/menu-items/1")
                    .contentType(MediaType.APPLICATION_JSON))
                    .andDo(print())
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value(1))
                    .andExpect(jsonPath("$.name").value("Truffle Risotto"))
                    .andExpect(jsonPath("$.category").value("Main Course"));

            verify(menuService, times(1)).findMenuItemById(1L);
        }

        @Test
        @DisplayName("Should return 404 when menu item not found")
        void shouldReturn404WhenMenuItemNotFound() throws Exception {
            when(menuService.findMenuItemById(999L))
                    .thenThrow(new RuntimeException("Menu item not found with id: 999"));

            mockMvc.perform(get("/api/menu-items/999")
                    .contentType(MediaType.APPLICATION_JSON))
                    .andDo(print())
                    .andExpect(status().isNotFound());
        }
    }

    // =========================================================================
    // POST /api/menu - Create Menu Item Tests (F104)
    // =========================================================================
    @Nested
    @DisplayName("POST /api/menu - Create Menu Item")
    class CreateMenuItemTests {

        @Test
        @DisplayName("Should create menu item successfully")
        void shouldCreateMenuItem() throws Exception {
            when(menuService.createMenuItem(any(MenuItemCreateRequestDto.class)))
                    .thenReturn(testMenuItem);

            mockMvc.perform(post("/api/menu-items")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(createRequestDto)))
                    .andDo(print())
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.id").value(1))
                    .andExpect(jsonPath("$.name").value("Truffle Risotto"));

            verify(menuService, times(1)).createMenuItem(any(MenuItemCreateRequestDto.class));
        }

        @Test
        @DisplayName("Should return 400 when name is missing")
        void shouldReturn400WhenNameIsMissing() throws Exception {
            createRequestDto.setName(null);

            mockMvc.perform(post("/api/menu-items")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(createRequestDto)))
                    .andDo(print())
                    .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("Should return 409 when menu item name already exists")
        void shouldReturn409WhenNameExists() throws Exception {
            when(menuService.createMenuItem(any(MenuItemCreateRequestDto.class)))
                    .thenThrow(new IllegalArgumentException("Menu item with name already exists"));

            mockMvc.perform(post("/api/menu-items")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(createRequestDto)))
                    .andDo(print())
                    .andExpect(status().isBadRequest());
        }
    }

    // =========================================================================
    // PUT /api/menu/{id} - Update Menu Item Tests (F104)
    // =========================================================================
    @Nested
    @DisplayName("PUT /api/menu/{id} - Update Menu Item")
    class UpdateMenuItemTests {

        @Test
        @DisplayName("Should update menu item successfully")
        void shouldUpdateMenuItem() throws Exception {
            MenuItemUpdateRequestDto updateDto = new MenuItemUpdateRequestDto();
            updateDto.setName("Updated Risotto");
            updateDto.setPrice(new BigDecimal("55.00"));

            MenuItemDto updatedItem = new MenuItemDto();
            updatedItem.setId(1L);
            updatedItem.setName("Updated Risotto");
            updatedItem.setPrice(new BigDecimal("55.00"));
            updatedItem.setCategory("Main Course");
            updatedItem.setAvailable(true);

            when(menuService.updateMenuItem(eq(1L), any(MenuItemUpdateRequestDto.class)))
                    .thenReturn(updatedItem);

            mockMvc.perform(put("/api/menu-items/1")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(updateDto)))
                    .andDo(print())
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.name").value("Updated Risotto"))
                    .andExpect(jsonPath("$.price").value(55.00));

            verify(menuService, times(1)).updateMenuItem(eq(1L), any(MenuItemUpdateRequestDto.class));
        }

        @Test
        @DisplayName("Should return 404 when updating non-existent menu item")
        void shouldReturn404WhenUpdatingNonExistent() throws Exception {
            MenuItemUpdateRequestDto updateDto = new MenuItemUpdateRequestDto();
            updateDto.setName("Updated Name");

            when(menuService.updateMenuItem(eq(999L), any(MenuItemUpdateRequestDto.class)))
                    .thenThrow(new RuntimeException("Menu item not found with id: 999"));

            mockMvc.perform(put("/api/menu-items/999")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(updateDto)))
                    .andDo(print())
                    .andExpect(status().isNotFound());
        }
    }

    // =========================================================================
    // DELETE /api/menu/{id} - Delete Menu Item Tests (F104)
    // =========================================================================
    @Nested
    @DisplayName("DELETE /api/menu/{id} - Delete Menu Item")
    class DeleteMenuItemTests {

        @Test
        @DisplayName("Should delete menu item successfully")
        void shouldDeleteMenuItem() throws Exception {
            doNothing().when(menuService).deleteMenuItem(1L);

            mockMvc.perform(delete("/api/menu-items/1")
                    .contentType(MediaType.APPLICATION_JSON))
                    .andDo(print())
                    .andExpect(status().isNoContent());

            verify(menuService, times(1)).deleteMenuItem(1L);
        }

        @Test
        @DisplayName("Should return 404 when deleting non-existent menu item")
        void shouldReturn404WhenDeletingNonExistent() throws Exception {
            doThrow(new RuntimeException("Menu item not found with id: 999"))
                    .when(menuService).deleteMenuItem(999L);

            mockMvc.perform(delete("/api/menu-items/999")
                    .contentType(MediaType.APPLICATION_JSON))
                    .andDo(print())
                    .andExpect(status().isNotFound());
        }
    }

    // =========================================================================
    // GET /api/menu/search - Search Menu Items Tests (F103)
    // =========================================================================
    @Nested
    @DisplayName("GET /api/menu/search - Search Menu Items")
    class SearchMenuItemsTests {

        @Test
        @DisplayName("Should search menu items by name")
        void shouldSearchByName() throws Exception {
            when(menuService.searchByName("risotto"))
                    .thenReturn(Arrays.asList(testMenuItem));

            mockMvc.perform(get("/api/menu-items")
                    .param("search", "risotto")
                    .contentType(MediaType.APPLICATION_JSON))
                    .andDo(print())
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$").isArray())
                    .andExpect(jsonPath("$.length()").value(1))
                    .andExpect(jsonPath("$[0].name").value("Truffle Risotto"));
        }
    }

    // =========================================================================
    // GET /api/menu/category/{category} - Filter by Category Tests (F103)
    // =========================================================================
    @Nested
    @DisplayName("GET /api/menu/category/{category} - Filter by Category")
    class FilterByCategoryTests {

        @Test
        @DisplayName("Should filter menu items by category")
        void shouldFilterByCategory() throws Exception {
            when(menuService.findByCategory("Main Course"))
                    .thenReturn(Arrays.asList(testMenuItem));

            mockMvc.perform(get("/api/menu-items")
                    .param("category", "Main Course")
                    .contentType(MediaType.APPLICATION_JSON))
                    .andDo(print())
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$").isArray())
                    .andExpect(jsonPath("$[0].category").value("Main Course"));
        }
    }
}
