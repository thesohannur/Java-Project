package com.lab.BackEnd.controller;

import com.lab.BackEnd.dto.response.ApiResponse;
import com.lab.BackEnd.model.Admin;
import com.lab.BackEnd.model.Campaign;
import com.lab.BackEnd.repository.AdminRepository;
import com.lab.BackEnd.repository.CampaignRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
// Remove @CrossOrigin - handled globally
public class AdminController {

    @Autowired
    private AdminRepository adminRepository;
    @Autowired
    private CampaignRepository campaignRepository;

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

    // ═══════════════════ CAMPAIGN MANAGEMENT ═══════════════════

    @GetMapping("/allUnApproved") //endpoint for admin to see all the Unapproved campaigns
    public ResponseEntity<List<Campaign>> getAllUnapprovedCampaigns() {
        List<Campaign> campaigns = campaignRepository.findByApproved(false);
        if (campaigns.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(campaigns);
    }
}
