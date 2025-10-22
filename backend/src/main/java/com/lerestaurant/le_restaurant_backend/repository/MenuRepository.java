package com.lerestaurant.le_restaurant_backend.repository;

import com.lerestaurant.le_restaurant_backend.entity.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for MenuItem entity (F103, F104)
 * Provides database access methods for menu management operations
 * 
 * @author Le Restaurant Development Team
 * @module F103-MenuDisplay, F104-MenuManagement
 */
@Repository
public interface MenuRepository extends JpaRepository<MenuItem, Long> {
    
    /**
     * Find menu item by exact name
     * @param name The name to search for
     * @return Optional containing the menu item if found
     */
    Optional<MenuItem> findByName(String name);
    
    /**
     * Search menu items by name (case-insensitive, partial match)
     * @param name The name to search for
     * @return List of matching menu items
     */
    List<MenuItem> findByNameContainingIgnoreCase(String name);
    
    /**
     * Find menu items by category
     * @param category The category to filter by
     * @return List of menu items in the category
     */
    List<MenuItem> findByCategory(String category);
    
    /**
     * Find menu items by availability status
     * @param available The availability status
     * @return List of menu items with matching availability
     */
    List<MenuItem> findByAvailable(boolean available);
    
    /**
     * Get all distinct categories from menu items
     * @return List of unique category names
     */
    @Query("SELECT DISTINCT m.category FROM MenuItem m ORDER BY m.category")
    List<String> findDistinctCategories();
    
    /**
     * Find menu items by category and availability
     * @param category The category to filter by
     * @param available The availability status
     * @return List of matching menu items
     */
    List<MenuItem> findByCategoryAndAvailable(String category, boolean available);
}
