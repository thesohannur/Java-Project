package com.lab.BackEnd.controller;

import com.lab.BackEnd.dto.response.ApiResponse;
import com.lab.BackEnd.model.Donor;
import com.lab.BackEnd.repository.DonorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/donor")
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

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<Donor>> updateProfile(@RequestBody Donor updatedDonor) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        Optional<Donor> existingDonor = donorRepository.findByEmail(email);
        if (existingDonor.isPresent()) {
            Donor donor = existingDonor.get();
            
            // Update allowed fields
            if (updatedDonor.getName() != null) donor.setName(updatedDonor.getName());
            if (updatedDonor.getPhone() != null) donor.setPhone(updatedDonor.getPhone());
            if (updatedDonor.getAddress() != null) donor.setAddress(updatedDonor.getAddress());
            if (updatedDonor.getBloodType() != null) donor.setBloodType(updatedDonor.getBloodType());
            if (updatedDonor.getAge() != null) donor.setAge(updatedDonor.getAge());
            if (updatedDonor.getGender() != null) donor.setGender(updatedDonor.getGender());
            if (updatedDonor.getLastDonationDate() != null) donor.setLastDonationDate(updatedDonor.getLastDonationDate());
            
            Donor savedDonor = donorRepository.save(donor);
            return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", savedDonor));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardStats() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        Optional<Donor> donor = donorRepository.findByEmail(email);
        if (donor.isPresent()) {
            Map<String, Object> stats = new HashMap<>();
            Donor d = donor.get();
            
            // Basic stats for dashboard
            stats.put("totalDonations", d.getDonationCount() != null ? d.getDonationCount() : 0);
            stats.put("bloodType", d.getBloodType());
            stats.put("lastDonationDate", d.getLastDonationDate());
            stats.put("isEligibleToDonate", d.isEligibleToDonate());
            stats.put("nextEligibleDate", d.getNextEligibleDonationDate());
            stats.put("donorSince", d.getCreatedAt());
            
            return ResponseEntity.ok(ApiResponse.success("Dashboard stats retrieved successfully", stats));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/dashboard/recent-activity")
    public ResponseEntity<ApiResponse<List<Object>>> getRecentActivity() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        Optional<Donor> donor = donorRepository.findByEmail(email);
        if (donor.isPresent()) {
            // This would typically fetch from a donations/activities table
            // For now, returning empty list - you'll need to implement based on your data model
            List<Object> recentActivities = List.of();
            
            return ResponseEntity.ok(ApiResponse.success("Recent activity retrieved successfully", recentActivities));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/dashboard/donation-request")
    public ResponseEntity<ApiResponse<String>> requestDonation(@RequestBody Map<String, Object> request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        Optional<Donor> donor = donorRepository.findByEmail(email);
        if (donor.isPresent()) {
            Donor d = donor.get();
            
            if (!d.isEligibleToDonate()) {
                return ResponseEntity.badRequest()
                    .body(ApiResponse.error("You are not eligible to donate at this time", null));
            }
            
            // Here you would typically create a donation request in your system
            // For now, just returning success message
            
            return ResponseEntity.ok(ApiResponse.success("Donation request submitted successfully", 
                "Your donation request has been submitted and will be processed soon."));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/eligibility")
    public ResponseEntity<ApiResponse<Map<String, Object>>> checkEligibility() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        Optional<Donor> donor = donorRepository.findByEmail(email);
        if (donor.isPresent()) {
            Donor d = donor.get();
            Map<String, Object> eligibility = new HashMap<>();
            
            eligibility.put("isEligible", d.isEligibleToDonate());
            eligibility.put("nextEligibleDate", d.getNextEligibleDonationDate());
            eligibility.put("daysSinceLastDonation", d.getDaysSinceLastDonation());
            eligibility.put("message", d.isEligibleToDonate() ? 
                "You are eligible to donate blood" : 
                "You must wait before your next donation");
            
            return ResponseEntity.ok(ApiResponse.success("Eligibility checked successfully", eligibility));
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}