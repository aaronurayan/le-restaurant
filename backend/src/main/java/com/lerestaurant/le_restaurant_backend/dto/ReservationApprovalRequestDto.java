package com.lerestaurant.le_restaurant_backend.dto;

import jakarta.validation.constraints.*;

/**
 * Reservation Approval Request DTO (F109)
 * 
 * This DTO is used for manager approval/rejection of reservations.
 * 
 * @author Le Restaurant Development Team
 * @version 1.0.0
 * @since 2025-10-20
 * @module F108-F109-ReservationManagement
 */
public class ReservationApprovalRequestDto {
    
    @NotNull(message = "Approval status is required")
    private Boolean approved;
    
    private String rejectionReason; // Required if approved=false (validated in service)
    
    @NotNull(message = "Approver ID is required")
    private Long approverId; // Manager ID
    
    // Constructors
    public ReservationApprovalRequestDto() {}
    
    // Getters and Setters
    public Boolean getApproved() { return approved; }
    public void setApproved(Boolean approved) { this.approved = approved; }
    
    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }
    
    public Long getApproverId() { return approverId; }
    public void setApproverId(Long approverId) { this.approverId = approverId; }
}
