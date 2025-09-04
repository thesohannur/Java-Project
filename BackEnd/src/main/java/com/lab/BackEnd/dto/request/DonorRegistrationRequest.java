package com.lab.BackEnd.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DonorRegistrationResponse {
    
    @JsonProperty("success")
    private Boolean success;
    
    @JsonProperty("message")
    private String message;
    
    @JsonProperty("donorId")
    private String donorId;
    
    @JsonProperty("email")
    private String email;
    
    @JsonProperty("fullName")
    private String fullName;
    
    @JsonProperty("isApproved")
    private Boolean isApproved;
    
    @JsonProperty("isEmailVerified")
    private Boolean isEmailVerified;
    
    @JsonProperty("registrationDate")
    private LocalDateTime registrationDate;
    
    @JsonProperty("verificationEmailSent")
    private Boolean verificationEmailSent;
    
    // Static factory methods for common responses
    public static DonorRegistrationResponse success(String donorId, String email, String fullName) {
        return DonorRegistrationResponse.builder()
                .success(true)
                .message("Registration successful. Please check your email for verification.")
                .donorId(donorId)
                .email(email)
                .fullName(fullName)
                .isApproved(false)
                .isEmailVerified(false)
                .registrationDate(LocalDateTime.now())
                .verificationEmailSent(true)
                .build();
    }
    
    public static DonorRegistrationResponse failure(String message) {
        return DonorRegistrationResponse.builder()
                .success(false)
                .message(message)
                .verificationEmailSent(false)
                .build();
    }
    
    public static DonorRegistrationResponse emailAlreadyExists() {
        return failure("An account with this email already exists.");
    }
    
    public static DonorRegistrationResponse phoneAlreadyExists() {
        return failure("An account with this phone number already exists.");
    }
}