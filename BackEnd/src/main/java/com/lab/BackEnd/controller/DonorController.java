package com.lab.BackEnd.controller;

import com.lab.BackEnd.dto.response.ApiResponse;
import com.lab.BackEnd.model.Donor;
import com.lab.BackEnd.repository.DonorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@RestController
@RequestMapping("/api/donor")
// Remove @CrossOrigin - handled globally
public class DonorController {

    @Autowired
    private DonorRepository donorRepository;

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<Donor>> getProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        Optional<Donor> donor = donorRepository.findByEmail(email);
        if (donor.isPresent()) {
            return ResponseEntity.ok(ApiResponse.success("Profile retrieved successfully", donor.get()));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public Donor createDonation(@RequestBody Donor donor) {
        if (donor.getAmount() == null || donor.getAmount() <50) {
            System.out.println("Minimum amount criteria is not met");
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Minimum amount criteria is not met");
        }
        return donorRepository.save(donor);
    }

}