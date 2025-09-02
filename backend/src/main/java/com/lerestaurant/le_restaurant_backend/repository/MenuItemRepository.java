package com.lerestaurant.le_restaurant_backend.repository;

import com.lerestaurant.le_restaurant_backend.entity.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    
    List<MenuItem> findByCategory(String category);
    
    List<MenuItem> findByAvailableTrue();
    
    @Query("SELECT m FROM MenuItem m WHERE m.name LIKE %:keyword% OR m.description LIKE %:keyword%")
    List<MenuItem> searchByKeyword(@Param("keyword") String keyword);
    
    @Query("SELECT DISTINCT m.category FROM MenuItem m")
    List<String> findAllCategories();
}
