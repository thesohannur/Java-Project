package com.lab.BackEnd.controller;

import com.lab.BackEnd.dto.response.ApiResponse;
import com.lab.BackEnd.model.NGO;
import com.lab.BackEnd.repository.NGORepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/ngo")
@CrossOrigin(origins = "*")
public class NGOController {

    @Autowired
    private NGORepository ngoRepository;

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<NGO>> getProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        Optional<NGO> ngo = ngoRepository.findByEmail(email);
        if (ngo.isPresent()) {
            return ResponseEntity.ok(ApiResponse.success("Profile retrieved successfully", ngo.get()));
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}