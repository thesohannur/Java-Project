package com.lab.BackEnd.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Field;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

@Document(collection = "donors")
@Data // Combines @Getter, @Setter, @ToString, @EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class Donor {
    
    @Id
    private String donorId;
    
    @Indexed(unique = true)
    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    @Field("email")
    private String email;
    
    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;
    
    @NotBlank(message = "First name is required")
    @Size(max = 50, message = "First name cannot exceed 50 characters")
    private String firstName;
    
    @NotBlank(message = "Last name is required")
    @Size(max = 50, message = "Last name cannot exceed 50 characters")
    private String lastName;
    
    @Pattern(regexp = "^[+]?[0-9]{10,15}$", message = "Invalid phone number format")
    private String phoneNumber;
    
    @Size(max = 200, message = "Address cannot exceed 200 characters")
    private String address;
    
    @Size(max = 100, message = "Occupation cannot exceed 100 characters")
    private String occupation;
    
    @NotNull
    @Field("is_approved")
    private Boolean isApproved = false; // Admin must approve
    
    @NotNull
    @Field("total_donated")
    private Double totalDonated = 0.0;
    
    @CreatedDate
    @Field("registration_date")
    private LocalDateTime registrationDate;
    
    @LastModifiedDate
    @Field("last_modified_date")
    private LocalDateTime lastModifiedDate;
    
    // Optional user reference
    @Field("user_id")
    private String userId;
    
    // Additional fields that might be useful
    @Field("donation_history")
    private List<String> donationHistoryIds = new ArrayList<>(); // References to donation documents
    
    @Field("is_active")
    private Boolean isActive = true;
    
    @Field("verification_token")
    private String verificationToken; // For email verification
    
    @Field("is_email_verified")
    private Boolean isEmailVerified = false;
    
    @Field("preferred_contact_method")
    private String preferredContactMethod = "email"; // email, phone, sms
    
    // Constructors for common use cases
    public Donor(String email, String password, String firstName, String lastName) {
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.registrationDate = LocalDateTime.now();
        this.lastModifiedDate = LocalDateTime.now();
    }
    
    // Utility methods
    public String getFullName() {
        return firstName + " " + lastName;
    }
    
    public void addDonation(Double amount) {
        if (amount != null && amount > 0) {
            this.totalDonated += amount;
            this.lastModifiedDate = LocalDateTime.now();
        }
    }
    
    public void addDonationHistoryId(String donationId) {
        if (donationId != null && !donationHistoryIds.contains(donationId)) {
            this.donationHistoryIds.add(donationId);
        }
    }
    
    // Override setter for lastModifiedDate to auto-update
    public void setFirstName(String firstName) {
        this.firstName = firstName;
        this.lastModifiedDate = LocalDateTime.now();
    }
    
    public void setLastName(String lastName) {
        this.lastName = lastName;
        this.lastModifiedDate = LocalDateTime.now();
    }
    
    public void setEmail(String email) {
        this.email = email;
        this.lastModifiedDate = LocalDateTime.now();
    }
    
    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
        this.lastModifiedDate = LocalDateTime.now();
    }
    
    public void setAddress(String address) {
        this.address = address;
        this.lastModifiedDate = LocalDateTime.now();
    }
    
    public void setOccupation(String occupation) {
        this.occupation = occupation;
        this.lastModifiedDate = LocalDateTime.now();
    }
}