package com.lab.BackEnd.controller;

import com.lab.BackEnd.dto.response.ApiResponse;
import com.lab.BackEnd.model.*;
import com.lab.BackEnd.repository.CampaignRepository;
import com.lab.BackEnd.repository.NGORepository;
import com.lab.BackEnd.repository.PaymentRepository;
import com.lab.BackEnd.service.VolunteerOpportunityService;
import com.lab.BackEnd.service.VolunteerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/ngo")
public class NGOController {

    @Autowired
    private NGORepository ngoRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private VolunteerOpportunityService volunteerOpportunityService;

    @Autowired
    private VolunteerService volunteerService;

    @Autowired
    private CampaignRepository campaignRepository;

    // ═══════════════════ PUBLIC ENDPOINTS FOR DONORS ═══════════════════

    @GetMapping("/public/ngos")
    public ResponseEntity<ApiResponse<List<NGO>>> getAllNGOsPublic(
            @RequestParam(required = false) String search) {
        try {
            List<NGO> ngos;
            if (search != null && !search.trim().isEmpty()) {
                ngos = ngoRepository.findByOrganizationNameContainingIgnoreCaseOrAddressContainingIgnoreCase(
                        search.trim(), search.trim());
            } else {
                ngos = ngoRepository.findAll();
            }
            return ResponseEntity.ok(ApiResponse.success("NGOs retrieved successfully", ngos));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve NGOs: " + e.getMessage()));
        }
    }

    @GetMapping("/public/campaigns/active")
    public ResponseEntity<ApiResponse<List<Campaign>>> getActiveCampaignsPublic() {
        try {
            List<Campaign> activeCampaigns = campaignRepository.findByApprovedTrue();
            return ResponseEntity.ok(ApiResponse.success("Active campaigns retrieved", activeCampaigns));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve campaigns: " + e.getMessage()));
        }
    }

    @GetMapping("/public/volunteer-opportunities")
    public ResponseEntity<ApiResponse<List<VolunteerOpportunity>>> getActiveOpportunitiesPublic() {
        try {
            List<VolunteerOpportunity> opportunities = volunteerOpportunityService.active();
            return ResponseEntity.ok(ApiResponse.success("Opportunities retrieved", opportunities));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve opportunities: " + e.getMessage()));
        }
    }

    @GetMapping("/public/ngos/{ngoId}")
    public ResponseEntity<ApiResponse<NGO>> getNGODetailsPublic(@PathVariable String ngoId) {
        try {
            Optional<NGO> ngo = ngoRepository.findById(ngoId);
            if (ngo.isPresent()) {
                return ResponseEntity.ok(ApiResponse.success("NGO details retrieved", ngo.get()));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve NGO: " + e.getMessage()));
        }
    }

    @GetMapping("/public/ngos/{ngoId}/campaigns")
    public ResponseEntity<ApiResponse<List<Campaign>>> getCampaignsByNGOPublic(@PathVariable String ngoId) {
        try {
            Optional<NGO> ngo = ngoRepository.findById(ngoId);
            if (ngo.isPresent()) {
                List<Campaign> campaigns = campaignRepository.findByNgoEmailAndApprovedTrue(ngo.get().getEmail());
                return ResponseEntity.ok(ApiResponse.success("NGO campaigns retrieved", campaigns));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve NGO campaigns: " + e.getMessage()));
        }
    }

    // ═══════════════════ EXISTING NGO ENDPOINTS ═══════════════════

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<NGO>> getProfile() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<NGO> ngo = ngoRepository.findByEmail(email);
        if (ngo.isPresent()) {
            return ResponseEntity.ok(ApiResponse.success("Profile retrieved successfully", ngo.get()));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/profile")
    public ResponseEntity<ApiResponse<NGO>> updateProfile(@RequestBody Map<String, Object> updates) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        NGO ngo = ngoRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "NGO not found"));

        // Update only provided fields
        if (updates.containsKey("organizationName")) {
            ngo.setOrganizationName((String) updates.get("organizationName"));
        }
        if (updates.containsKey("contactPerson")) {
            ngo.setContactPerson((String) updates.get("contactPerson"));
        }
        if (updates.containsKey("phoneNumber")) {
            ngo.setPhoneNumber((String) updates.get("phoneNumber"));
        }
        if (updates.containsKey("address")) {
            ngo.setAddress((String) updates.get("address"));
        }
        if (updates.containsKey("website")) {
            ngo.setWebsite((String) updates.get("website"));
        }
        if (updates.containsKey("description")) {
            ngo.setDescription((String) updates.get("description"));
        }

        ngoRepository.save(ngo);
        return ResponseEntity.ok(ApiResponse.success("NGO profile updated successfully", ngo));
    }

    // ═══════════════════ DONATIONS MANAGEMENT ═══════════════════

    @GetMapping("/donations")
    public ResponseEntity<ApiResponse<List<Payment>>> getPendingDonations() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        NGO ngo = ngoRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "NGO not found"));

        List<Payment> donations = paymentRepository.findByNgoId(ngo.getNgoId());
        return ResponseEntity.ok(ApiResponse.success("Donations retrieved successfully", donations));
    }

    // ═══════════════════ VOLUNTEER OPPORTUNITY MANAGEMENT ═══════════════════

    @PostMapping("/volunteer-opportunities")
    public ResponseEntity<ApiResponse<VolunteerOpportunity>> createVolunteerOpportunity(
            @Valid @RequestBody VolunteerOpportunity request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        NGO ngo = ngoRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "NGO not found"));

        request.setNgoId(ngo.getNgoId());
        VolunteerOpportunity opportunity = volunteerOpportunityService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Volunteer opportunity created successfully", opportunity));
    }

    @GetMapping("/volunteer-opportunities")
    public ResponseEntity<ApiResponse<List<VolunteerOpportunity>>> getVolunteerOpportunities() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        NGO ngo = ngoRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "NGO not found"));

        List<VolunteerOpportunity> opportunities = volunteerOpportunityService.ofNgo(ngo.getNgoId());
        return ResponseEntity.ok(ApiResponse.success("Volunteer opportunities retrieved successfully", opportunities));
    }

    @PutMapping("/volunteer-opportunities/{id}/close")
    public ResponseEntity<ApiResponse<String>> closeVolunteerOpportunity(@PathVariable String id) {
        volunteerOpportunityService.close(id);
        return ResponseEntity.ok(ApiResponse.success("Volunteer opportunity closed successfully"));
    }

    // ═══════════════════ VOLUNTEER APPLICATION MANAGEMENT ═══════════════════

    @GetMapping("/volunteers")
    public ResponseEntity<ApiResponse<List<Volunteer>>> getVolunteerApplications() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        NGO ngo = ngoRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "NGO not found"));

        List<Volunteer> volunteers = volunteerService.ngoVols(ngo.getNgoId());
        return ResponseEntity.ok(ApiResponse.success("Volunteer applications retrieved successfully", volunteers));
    }

    @PutMapping("/volunteers/{id}/approve")
    public ResponseEntity<ApiResponse<Volunteer>> approveVolunteer(@PathVariable String id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        NGO ngo = ngoRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "NGO not found"));

        Volunteer volunteer = volunteerService.approve(id, ngo.getNgoId());
        return ResponseEntity.ok(ApiResponse.success("Volunteer application approved successfully", volunteer));
    }

    @PutMapping("/volunteers/{id}/complete")
    public ResponseEntity<ApiResponse<Volunteer>> completeVolunteer(
            @PathVariable String id, @RequestBody Map<String, Integer> request) {
        Integer hoursDone = request.get("hoursDone");
        Volunteer volunteer = volunteerService.complete(id, hoursDone);
        return ResponseEntity.ok(ApiResponse.success("Volunteer work marked as completed successfully", volunteer));
    }

    // ═══════════════════ CAMPAIGN MANAGEMENT ═══════════════════

    @PostMapping("/campaigns")
    public ResponseEntity<?> createCampaign(@RequestBody Map<String, Object> campaignData) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();

            // Extract data from request
            String description = (String) campaignData.get("description");
            String expirationTime = (String) campaignData.get("expirationTime");
            Integer volunteerTime = campaignData.get("volunteerTime") != null ?
                    Integer.valueOf(campaignData.get("volunteerTime").toString()) : null;
            Boolean acceptsMoney = (Boolean) campaignData.getOrDefault("acceptsMoney", true);
            Boolean acceptsTime = (Boolean) campaignData.getOrDefault("acceptsTime", false);

            // Manual validation
            if (description == null || description.trim().length() < 10) {
                return ResponseEntity.badRequest().body("Description must be at least 10 characters long");
            }

            if (!acceptsMoney && !acceptsTime) {
                return ResponseEntity.badRequest().body("Campaign must accept money, time, or both");
            }

            if (acceptsTime && (volunteerTime == null || volunteerTime <= 0)) {
                return ResponseEntity.badRequest().body("Volunteer hours required when accepting time donations");
            }

            // Create campaign
            LocalDateTime expiry = null;
            if (expirationTime != null && !expirationTime.isEmpty()) {
                expiry = LocalDateTime.parse(expirationTime);
            }

            Campaign campaign = new Campaign(email, expiry, volunteerTime, description.trim(), acceptsMoney, acceptsTime);
            Campaign savedCampaign = campaignRepository.save(campaign);

            return ResponseEntity.ok(savedCampaign);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to create campaign: " + e.getMessage());
        }
    }

    @GetMapping("/campaigns")
    public ResponseEntity<List<Campaign>> getCampaignsByNgo() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        List<Campaign> campaigns = campaignRepository.findByNgoEmail(email);
        if (campaigns.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(campaigns);
    }

    @PutMapping("/campaigns/{campaignId}")
    public ResponseEntity<?> updateCampaign(@PathVariable String campaignId, @RequestBody Map<String, Object> updatedData) {
        Optional<Campaign> existingOpt = campaignRepository.findById(campaignId);
        if (existingOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Campaign not found");
        }

        Campaign existing = existingOpt.get();

        // Validate campaign type changes
        Boolean acceptsMoney = (Boolean) updatedData.getOrDefault("acceptsMoney", existing.isAcceptsMoney());
        Boolean acceptsTime = (Boolean) updatedData.getOrDefault("acceptsTime", existing.isAcceptsTime());
        Integer volunteerTime = updatedData.get("volunteerTime") != null ?
                Integer.valueOf(updatedData.get("volunteerTime").toString()) : existing.getVolunteerTime();

        if (!acceptsMoney && !acceptsTime) {
            return ResponseEntity.badRequest().body("Campaign must accept money or time (or both)");
        }

        if (acceptsTime && (volunteerTime == null || volunteerTime <= 0)) {
            return ResponseEntity.badRequest().body("Please provide positive volunteer hours for time-based campaigns");
        }

        // Update fields
        if (updatedData.containsKey("description")) {
            String desc = (String) updatedData.get("description");
            if (desc != null && desc.trim().length() >= 10) {
                existing.setDescription(desc.trim());
            }
        }

        if (updatedData.containsKey("volunteerTime")) {
            existing.setVolunteerTime(volunteerTime);
        }

        if (updatedData.containsKey("expirationTime")) {
            String expStr = (String) updatedData.get("expirationTime");
            if (expStr != null && !expStr.isEmpty()) {
                existing.setExpirationTime(LocalDateTime.parse(expStr));
                existing.setManualDeletionAllowed(false);
            } else {
                existing.setExpirationTime(null);
                existing.setManualDeletionAllowed(true);
            }
        }

        // Update campaign type settings
        existing.setAcceptsMoney(acceptsMoney);
        existing.setAcceptsTime(acceptsTime);
        existing.setPendingCheckup(false);

        Campaign saved = campaignRepository.save(existing);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/campaigns/{campaignId}")
    public ResponseEntity<?> deleteCampaign(@PathVariable String campaignId) {
        Optional<Campaign> campaignOpt = campaignRepository.findById(campaignId);
        if (campaignOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Campaign not found");
        }

        Campaign campaign = campaignOpt.get();
        if (!campaign.isManualDeletionAllowed()) {
            return ResponseEntity.badRequest().body("Cannot delete campaign with expiry date set");
        }

        campaignRepository.deleteById(campaignId);
        return ResponseEntity.ok().body("Campaign deleted successfully");
    }
}
