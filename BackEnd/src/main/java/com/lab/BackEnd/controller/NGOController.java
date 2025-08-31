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

    // ═══════════════════ PROFILE MANAGEMENT ═══════════════════

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

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<NGO>> updateProfile(@Valid @RequestBody NGO updatedNgo) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        NGO ngo = ngoRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "NGO not found"));

        ngo.setOrganizationName(updatedNgo.getOrganizationName());
        ngo.setContactPerson(updatedNgo.getContactPerson());
        ngo.setPhoneNumber(updatedNgo.getPhoneNumber());
        ngo.setAddress(updatedNgo.getAddress());
        ngo.setWebsite(updatedNgo.getWebsite());
        ngo.setDescription(updatedNgo.getDescription());
        ngo.setFocusAreas(updatedNgo.getFocusAreas());
        ngo.setLogo(updatedNgo.getLogo());

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



    //Basic functionalities:
    //Money will be needed, no need to mention it explicitly
    //If volunteerTime is mentioned then it will require specific volunteer time from donor otherwise not needed
    //If expirationTime is null, then need to delete the campaign manually otherwise it has to be deleted manually
    @PostMapping("/createCampaign")
    public ResponseEntity<?> createCampaign(@RequestBody Campaign campBody) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();


        if (campBody.getDescription() == null || campBody.getDescription().length() < 10) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Minimum description length is 10 characters.");
        }

        // Create and save
        Campaign campaign = new Campaign(
                email,
                campBody.getExpirationTime(),
                campBody.getVolunteerTime(),
                campBody.getDescription()
        );

        Campaign savedCampaign = campaignRepository.save(campaign);
        return ResponseEntity.ok(savedCampaign);
    }

    @GetMapping("/viewCampaign")
    public ResponseEntity<List<Campaign>> getCampaignsByNgo() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        List<Campaign> campaigns = campaignRepository.findByNgoEmail(email);
        if (campaigns.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(campaigns);
    }

    @PutMapping("/updateCampaign/{campaignId}") //campaign to be updated by NGO
    public ResponseEntity<?> updateCampaign(@PathVariable String campaignId, @RequestBody Campaign updatedData) {
        Optional<Campaign> existingOpt = campaignRepository.findById(campaignId);
        if (existingOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Campaign not found");
        }

        Campaign existing = existingOpt.get();

        if (updatedData.getVolunteerTime() != null) {
            existing.setVolunteerTime(updatedData.getVolunteerTime());
        }

        if (updatedData.getExpirationTime() != null) {
            existing.setExpirationTime(updatedData.getExpirationTime()); // Expecting Promittee (frontend) to send proper ISO date
            existing.setManualDeletionAllowed(false); // reset that means cannot be deleted manually
        } else {
            existing.setExpirationTime(null);
            existing.setManualDeletionAllowed(true);
        }

        Campaign saved = campaignRepository.save(existing);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/deleteCampaign/{campaignId}")
    public ResponseEntity<?> deleteCampaign(@PathVariable String campaignId) {
        Optional<Campaign> campaignOpt = campaignRepository.findById(campaignId);

        if (campaignOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Campaign not found");
        }

        Campaign campaign = campaignOpt.get();

        if (!campaign.isManualDeletionAllowed()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Campaign cannot be deleted. Expiry date has been set.");
        }

        campaignRepository.deleteById(campaignId);
        return ResponseEntity.ok("Campaign deleted successfully.");
    }

}
