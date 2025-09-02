package com.lerestaurant.le_restaurant_backend.service;

import com.lerestaurant.le_restaurant_backend.dto.UserDto;
import com.lerestaurant.le_restaurant_backend.entity.User;
import com.lerestaurant.le_restaurant_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserService {
    
    private final UserRepository userRepository;
    
    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    // 모든 사용자 조회 (매니저용)
    public List<UserDto> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(UserDto::new)
                .collect(Collectors.toList());
    }
    
    // ID로 사용자 조회
    public UserDto getUserById(Long id) {
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()) {
            return new UserDto(user.get());
        }
        throw new RuntimeException("User not found with id: " + id);
    }
    
    // 이메일로 사용자 조회
    public UserDto getUserByEmail(String email) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent()) {
            return new UserDto(user.get());
        }
        throw new RuntimeException("User not found with email: " + email);
    }
    
    // 사용자 생성
    public UserDto createUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("User with email already exists: " + user.getEmail());
        }
        User savedUser = userRepository.save(user);
        return new UserDto(savedUser);
    }
    
    // 사용자 정보 업데이트
    public UserDto updateUser(Long id, User userDetails) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setFirstName(userDetails.getFirstName());
            user.setLastName(userDetails.getLastName());
            user.setPhoneNumber(userDetails.getPhoneNumber());
            user.setStatus(userDetails.getStatus());
            user.setRole(userDetails.getRole());
            
            User updatedUser = userRepository.save(user);
            return new UserDto(updatedUser);
        }
        throw new RuntimeException("User not found with id: " + id);
    }
    
    // 사용자 상태 변경
    public UserDto updateUserStatus(Long id, User.UserStatus status) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setStatus(status);
            User updatedUser = userRepository.save(user);
            return new UserDto(updatedUser);
        }
        throw new RuntimeException("User not found with id: " + id);
    }
    
    // 사용자 삭제 (소프트 삭제)
    public void deleteUser(Long id) {
        updateUserStatus(id, User.UserStatus.DELETED);
    }
    
    // 역할별 사용자 조회
    public List<UserDto> getUsersByRole(User.UserRole role) {
        List<User> users = userRepository.findByRole(role);
        return users.stream()
                .map(UserDto::new)
                .collect(Collectors.toList());
    }
    
    // 활성 사용자만 조회
    public List<UserDto> getActiveUsers() {
        List<User> users = userRepository.findByStatus(User.UserStatus.ACTIVE);
        return users.stream()
                .map(UserDto::new)
                .collect(Collectors.toList());
    }
    
    // 이름으로 사용자 검색
    public List<UserDto> searchUsersByName(String keyword) {
        List<User> users = userRepository.findByNameContaining(keyword);
        return users.stream()
                .map(UserDto::new)
                .collect(Collectors.toList());
    }
}
