package com.lerestaurant.le_restaurant_backend.repository;

import com.lerestaurant.le_restaurant_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // 이메일로 사용자 찾기
    Optional<User> findByEmail(String email);
    
    // 이메일 존재 여부 확인
    boolean existsByEmail(String email);
    
    // 역할별 사용자 조회
    List<User> findByRole(User.UserRole role);
    
    // 상태별 사용자 조회
    List<User> findByStatus(User.UserStatus status);
    
    // 이름으로 검색 (부분 일치)
    @Query("SELECT u FROM User u WHERE u.firstName LIKE %:keyword% OR u.lastName LIKE %:keyword%")
    List<User> findByNameContaining(@Param("keyword") String keyword);
    
    // 활성 사용자만 조회
    List<User> findByStatusAndRole(User.UserStatus status, User.UserRole role);
}
