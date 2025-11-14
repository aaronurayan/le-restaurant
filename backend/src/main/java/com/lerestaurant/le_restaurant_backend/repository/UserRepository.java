package com.lerestaurant.le_restaurant_backend.repository;

import com.lerestaurant.le_restaurant_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    
    List<User> findByRole(User.UserRole role);
    
    List<User> findByStatus(User.UserStatus status);
    
    List<User> findByRoleAndStatus(User.UserRole role, User.UserStatus status);
    
    boolean existsByEmail(String email);
}


