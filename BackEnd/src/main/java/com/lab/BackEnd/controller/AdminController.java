package com.lab.BackEnd.controller;

import com.lab.BackEnd.dto.response.ApiResponse;
import com.lab.BackEnd.model.Admin;
import com.lab.BackEnd.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
// Remove @CrossOrigin - handled globally
public class AdminController {

    @Autowired
    private AdminRepository adminRepository;

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<Admin>> getProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        Optional<Admin> admin = adminRepository.findByEmail(email);
        if (admin.isPresent()) {
            return ResponseEntity.ok(ApiResponse.success("Profile retrieved successfully", admin.get()));
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
