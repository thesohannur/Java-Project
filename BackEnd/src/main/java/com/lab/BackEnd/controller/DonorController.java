package com.lab.BackEnd.controller;

import com.lab.BackEnd.dto.request.VolunteerRequest;
import com.lab.BackEnd.dto.response.ApiResponse;
import com.lab.BackEnd.model.*;
import com.lab.BackEnd.repository.CampaignRepository;
import com.lab.BackEnd.repository.DonorRepository;
import com.lab.BackEnd.repository.PaymentRepository;
import com.lab.BackEnd.service.PaymentService;
import com.lab.BackEnd.service.VolunteerService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.CacheManager;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/donor")
public class DonorController {

    @Autowired
    private DonorRepository donorRepository;
    @Autowired
    private PaymentService paymentService;
    @Autowired
    private PaymentRepository paymentRepository;
    @Autowired
    private VolunteerService volunteerService;
    @Autowired
    private CampaignRepository campaignRepository;

    /* ─────────────────── PROFILE ENDPOINTS ─────────────────── */

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<Donor>> getProfile() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<Donor> donor = donorRepository.findByEmail(email);

        return donor.map(d -> ResponseEntity.ok(ApiResponse.success("Profile retrieved", d))).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<Donor>> updateProfile(@RequestBody Donor updated) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Donor donor = donorRepository.findByEmail(email).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Donor not found"));

        donor.setFirstName(updated.getFirstName());
        donor.setLastName(updated.getLastName());
        donor.setPhoneNumber(updated.getPhoneNumber());
        donor.setAddress(updated.getAddress());
        donor.setOccupation(updated.getOccupation());
        donor.setProfileImage(updated.getProfileImage());

        donorRepository.save(donor);
        return ResponseEntity.ok(ApiResponse.success("Profile updated", donor));
    }

    @DeleteMapping("/profile")
    public ResponseEntity<ApiResponse<String>> deleteProfile() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Donor donor = donorRepository.findByEmail(email).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Donor not found"));

        donorRepository.delete(donor);
        return ResponseEntity.ok(ApiResponse.success("Profile deleted"));
    }

    /* ─────────────────── MONEY DONATION ─────────────────── */

    @PostMapping("/donate")
    public ResponseEntity<ApiResponse<String>> donate(@RequestBody Donor dto) {

        if (dto.getAmount() == null || dto.getAmount() <= 50)
            return ResponseEntity.badRequest().body(ApiResponse.error("Amount must be >50"));

        if (dto.getNgoID() == null) return ResponseEntity.badRequest().body(ApiResponse.error("NGO ID missing"));

        if (!paymentService.processPayment()) {
            paymentRepository.save(new Payment(dto.getDonorId(), dto.getNgoID(), dto.getAmount(), "FAILED"));
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(ApiResponse.error("Payment failed"));
        }

        paymentRepository.save(new Payment(dto.getDonorId(), dto.getNgoID(), dto.getAmount(), "SUCCESS"));
        return ResponseEntity.ok(ApiResponse.success("Donation recorded"));
    }

    @GetMapping("/{donorId}")
    public List<Payment> getDonationsByUser(@PathVariable String donorId) {
        return paymentRepository.findByDonorId(donorId);
    }

    /* ─────────────────── VOLUNTEER ENDPOINTS ─────────────────── */

    @PostMapping("/volunteer")
    public ResponseEntity<ApiResponse<Volunteer>> applyVolunteer(@Valid @RequestBody VolunteerRequest req) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Donor donor = donorRepository.findByEmail(email).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Donor not found"));

        Volunteer volunteer = volunteerService.apply(donor.getDonorId(), req.getOpportunityId(), req.getMessage(), req.getHoursCommitted());

        return ResponseEntity.ok(ApiResponse.success("Volunteer application submitted", volunteer));
    }

    @GetMapping("/volunteers")
    public ResponseEntity<ApiResponse<List<Volunteer>>> myVolunteers() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Donor donor = donorRepository.findByEmail(email).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Donor not found"));

        List<Volunteer> history = volunteerService.donorHistory(donor.getDonorId());
        return ResponseEntity.ok(ApiResponse.success("Volunteer history", history));
    }

    // ═══════════════════ CAMPAIGN MANAGEMENT ═══════════════════


    @GetMapping("/allApproved") //endpoint for donor to see all the approved campaigns
    public ResponseEntity<List<Campaign>> getAllApprovedCampaigns() {
        List<Campaign> campaigns = campaignRepository.findByApproved(true);
        if (campaigns.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(campaigns);
    }

    @PostMapping("/camp/{campaignId}")
    public ResponseEntity<Campaign> donateToCampaign(@PathVariable String campaignId, @RequestBody CampaignDonation donation) {

        Optional<Campaign> campaignOpt = campaignRepository.findById(campaignId);

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String donorEmail = authentication.getName();

        if (campaignOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        donation = new CampaignDonation(donorEmail, donation.getDonationAmount(), donation.getVolunteerTime());
        Campaign campaign = campaignOpt.get();
        campaign.totalRaised(donation.getDonationAmount());
        campaign.addDonation(donation);
        campaignRepository.save(campaign);

        return ResponseEntity.ok(campaign);
    }
}
