package com.lab.BackEnd.controller;

import com.lab.BackEnd.dto.response.ApiResponse;
import com.lab.BackEnd.model.Admin;
import com.lab.BackEnd.model.Campaign;
import com.lab.BackEnd.repository.AdminRepository;
import com.lab.BackEnd.repository.CampaignRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
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

    //update ngo profile
    @PutMapping("/update-profile")
    public ResponseEntity<?> updateProfile(@RequestBody Admin updateRequest) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();


        Optional<Admin> adminOpt = adminRepository.findByEmail(email);
        if (adminOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Admin not found");
        }

        Admin admin = adminOpt.get();

        if (updateRequest.getFullName() != null) {
            admin.setFullName(updateRequest.getFullName());
        }
        if (updateRequest.getProfileImage() != null) {
            admin.setProfileImage(updateRequest.getProfileImage());
        }

        admin.setLastLogin(LocalDateTime.now());
        Admin saved = adminRepository.save(admin);
        
        return ResponseEntity.ok(saved);
    }

    // ═══════════════════ CAMPAIGN MANAGEMENT ═══════════════════

    @GetMapping("/allUnApproved") //endpoint for admin to see all the Unapproved campaigns
    public ResponseEntity<List<Campaign>> getAllUnapprovedCampaigns() {
        List<Campaign> campaigns = campaignRepository.findByApprovedFalseAndPendingCheckupFalse();
        if (campaigns.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(campaigns);
    }

    @PutMapping("/approve-campaign/{campaignId}")
    public ResponseEntity<?> approveCampaign(@PathVariable String campaignId) {
        Optional <Campaign> campaigns = campaignRepository.findById(campaignId);
        if (campaigns.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        if(campaigns.get().isApproved())
            return ResponseEntity.badRequest().body("Campaign already approved");

        campaigns.get().setApproved(true);
        campaignRepository.save(campaigns.get());
        return ResponseEntity.ok().body(campaigns);
    }

    @PutMapping("/reject-campaign/{campaignId}")
    public ResponseEntity<?> rejectCampaign(@PathVariable String campaignId, @RequestBody String feedback) {
        Optional <Campaign> campaigns = campaignRepository.findById(campaignId);
        if (campaigns.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        if(campaigns.get().isApproved()) {
            return ResponseEntity.badRequest().body("Campaign already approved");
        }

        Integer rejectStatus = campaigns.get().getRejectFlag();
        rejectStatus++;
        if(rejectStatus >= 2) {
            campaignRepository.deleteById(campaignId);
            return ResponseEntity.ok().body("Due to double refusal campaign deleted successfully");
        }
        campaigns.get().setRejectFlag(rejectStatus);
        campaigns.get().setApproved(false);
        campaigns.get().setFeedback(feedback);
        campaigns.get().setPendingCheckup(true);
        campaignRepository.save(campaigns.get());
        return ResponseEntity.ok().body(campaigns);
    }




}
