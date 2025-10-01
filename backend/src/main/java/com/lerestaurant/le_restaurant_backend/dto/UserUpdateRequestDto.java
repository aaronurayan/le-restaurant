package com.lerestaurant.le_restaurant_backend.dto;

import com.lerestaurant.le_restaurant_backend.entity.User;

public class UserUpdateRequestDto {
    private String phoneNumber;
    private String firstName;
    private String lastName;
    private User.UserStatus status;
    private String profileImageUrl;

    // Constructors
    public UserUpdateRequestDto() {}

    public UserUpdateRequestDto(String phoneNumber, String firstName, String lastName, 
                               User.UserStatus status, String profileImageUrl) {
        this.phoneNumber = phoneNumber;
        this.firstName = firstName;
        this.lastName = lastName;
        this.status = status;
        this.profileImageUrl = profileImageUrl;
    }

    // Getters and Setters
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public User.UserStatus getStatus() { return status; }
    public void setStatus(User.UserStatus status) { this.status = status; }

    public String getProfileImageUrl() { return profileImageUrl; }
    public void setProfileImageUrl(String profileImageUrl) { this.profileImageUrl = profileImageUrl; }
}
