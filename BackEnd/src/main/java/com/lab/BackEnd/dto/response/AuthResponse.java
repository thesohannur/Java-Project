package com.lab.BackEnd.dto.response;

import com.lab.BackEnd.model.enums.UserRole;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
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

}