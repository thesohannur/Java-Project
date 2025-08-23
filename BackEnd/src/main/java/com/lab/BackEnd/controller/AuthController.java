package com.lab.BackEnd.controller;

import com.lab.BackEnd.dto.request.AdminRegistrationRequest;
import com.lab.BackEnd.dto.request.DonorRegistrationRequest;
import com.lab.BackEnd.dto.request.LoginRequest;
import com.lab.BackEnd.dto.request.NGORegistrationRequest;
import com.lab.BackEnd.dto.response.ApiResponse;
import com.lab.BackEnd.dto.response.AuthResponse;
import com.lab.BackEnd.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
// Remove @CrossOrigin(origins = "*") - CORS is handled globally now
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);

        if (response.getToken() != null) {
            return ResponseEntity.ok(ApiResponse.success("Login successful", response));
        } else {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(response.getMessage()));
        }
    }

    @PostMapping("/register/donor")
    public ResponseEntity<ApiResponse<AuthResponse>> registerDonor(@Valid @RequestBody DonorRegistrationRequest request) {
        AuthResponse response = authService.registerDonor(request);

        if (response.getToken() != null) {
            return ResponseEntity.ok(ApiResponse.success("Donor registration successful", response));
        } else {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(response.getMessage()));
        }
    }

    @PostMapping("/register/ngo")
    public ResponseEntity<ApiResponse<AuthResponse>> registerNGO(@Valid @RequestBody NGORegistrationRequest request) {
        AuthResponse response = authService.registerNGO(request);

        if (response.getToken() != null) {
            return ResponseEntity.ok(ApiResponse.success("NGO registration successful", response));
        } else {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(response.getMessage()));
        }
    }

    @PostMapping("/register/admin")
    public ResponseEntity<ApiResponse<AuthResponse>> registerAdmin(@Valid @RequestBody AdminRegistrationRequest request) {
        AuthResponse response = authService.registerAdmin(request);

        if (response.getToken() != null) {
            return ResponseEntity.ok(ApiResponse.success("Admin registration successful", response));
        } else {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(response.getMessage()));
        }
    }
}