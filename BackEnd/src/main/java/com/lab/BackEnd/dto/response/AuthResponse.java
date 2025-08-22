package com.lab.BackEnd.dto.response;

import com.lab.BackEnd.model.enums.UserRole;

public class AuthResponse {
    private String token;
    private String email;
    private UserRole role;
    private String userId;
    private String message;

    public AuthResponse() {}

    public AuthResponse(String token, String email, UserRole role, String userId, String message) {
        this.token = token;
        this.email = email;
        this.role = role;
        this.userId = userId;
        this.message = message;
    }

    // Getters and Setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public UserRole getRole() { return role; }
    public void setRole(UserRole role) { this.role = role; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}