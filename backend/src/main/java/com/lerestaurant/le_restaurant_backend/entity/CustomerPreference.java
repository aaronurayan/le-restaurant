package com.lerestaurant.le_restaurant_backend.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "customer_preferences")
public class CustomerPreference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "preference_id")
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "dietary_restrictions")
    private String dietaryRestrictions;

    @Column(name = "favorite_cuisines")
    private String favoriteCuisines;

    @Column(name = "allergens")
    private String allergens;

    @Column(name = "marketing_emails")
    private Boolean marketingEmails;

    @Column(name = "sms_notifications")
    private Boolean smsNotifications;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt = OffsetDateTime.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getDietaryRestrictions() { return dietaryRestrictions; }
    public void setDietaryRestrictions(String dietaryRestrictions) { this.dietaryRestrictions = dietaryRestrictions; }
    public String getFavoriteCuisines() { return favoriteCuisines; }
    public void setFavoriteCuisines(String favoriteCuisines) { this.favoriteCuisines = favoriteCuisines; }
    public String getAllergens() { return allergens; }
    public void setAllergens(String allergens) { this.allergens = allergens; }
    public Boolean getMarketingEmails() { return marketingEmails; }
    public void setMarketingEmails(Boolean marketingEmails) { this.marketingEmails = marketingEmails; }
    public Boolean getSmsNotifications() { return smsNotifications; }
    public void setSmsNotifications(Boolean smsNotifications) { this.smsNotifications = smsNotifications; }
    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
}


