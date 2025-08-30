package com.lab.BackEnd.controller;

import com.lab.BackEnd.dto.response.ApiResponse;
import com.lab.BackEnd.model.NGO;
import com.lab.BackEnd.model.Payment;
import com.lab.BackEnd.model.Volunteer;
import com.lab.BackEnd.model.VolunteerOpportunity;
import com.lab.BackEnd.repository.NGORepository;
import com.lab.BackEnd.repository.PaymentRepository;
import com.lab.BackEnd.service.VolunteerOpportunityService;
import com.lab.BackEnd.service.VolunteerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

}
