package com.lab.BackEnd.controller;

import com.lab.BackEnd.dto.request.VolunteerRequest;
import com.lab.BackEnd.dto.response.ApiResponse;
import com.lab.BackEnd.model.*;
import com.lab.BackEnd.repository.CampaignRepository;
import com.lab.BackEnd.repository.DonorRepository;
import com.lab.BackEnd.repository.PaymentRepository;
import com.lab.BackEnd.service.PaymentService;
import com.lab.BackEnd.service.VolunteerOpportunityService;
import com.lab.BackEnd.service.VolunteerService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
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

    @Autowired
    private VolunteerOpportunityService volunteerOpportunityService;

    /* ─────────────────── PROFILE ENDPOINTS ─────────────────── */

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<Donor>> getProfile() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<Donor> donor = donorRepository.findByEmail(email);
        return donor.map(d -> ResponseEntity.ok(ApiResponse.success("Profile retrieved", d)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<Donor>> updateProfile(@RequestBody Donor updated) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Donor donor = donorRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Donor not found"));

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
        Donor donor = donorRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Donor not found"));

        donorRepository.delete(donor);
        return ResponseEntity.ok(ApiResponse.success("Profile deleted"));
    }

    /* ─────────────────── MONEY DONATION ENDPOINTS ─────────────────── */

    @PostMapping("/donations")
    public ResponseEntity<ApiResponse<Payment>> makeDonation(@RequestBody Map<String, Object> donationData) {
        try {
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            Donor donor = donorRepository.findByEmail(email)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Donor not found"));

            // Extract donation data
            Double amount = Double.valueOf(donationData.get("amount").toString());
            String ngoId = (String) donationData.get("ngoId");
            String campaignId = (String) donationData.get("campaignId");
            String message = (String) donationData.get("message");

            // Validate amount
            if (amount == null || amount <= 50) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Amount must be greater than 50"));
            }

            // Validate NGO or campaign
            if (ngoId == null && campaignId == null) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Either NGO ID or Campaign ID is required"));
            }

            // Process payment (simulate payment processing)
            if (!paymentService.processPayment()) {
                Payment failedPayment = new Payment(donor.getDonorId(), ngoId, amount, "FAILED");
                paymentRepository.save(failedPayment);
                return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                        .body(ApiResponse.error("Payment processing failed"));
            }

            // Create successful payment record
            Payment payment = new Payment(donor.getDonorId(), ngoId, amount, "SUCCESS");
            payment.setTimestamp(LocalDateTime.now());
            if (campaignId != null) {
                // Add campaign ID to payment if donating through campaign
                // You'll need to add this field to Payment model
            }

            Payment savedPayment = paymentRepository.save(payment);

            // Update donor's total donated amount
            donor.setTotalDonated(donor.getTotalDonated() + amount);
            donorRepository.save(donor);

            return ResponseEntity.ok(ApiResponse.success("Donation successful", savedPayment));

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Donation failed: " + e.getMessage()));
        }
    }

    @GetMapping("/donations")
    public ResponseEntity<ApiResponse<List<Payment>>> getDonationHistory() {
        try {
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            Donor donor = donorRepository.findByEmail(email)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Donor not found"));

            List<Payment> donations = paymentRepository.findByDonorId(donor.getDonorId());
            return ResponseEntity.ok(ApiResponse.success("Donation history retrieved", donations));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve donation history: " + e.getMessage()));
        }
    }

    /* ─────────────────── VOLUNTEER ENDPOINTS ─────────────────── */

    @PostMapping("/volunteer-applications")
    public ResponseEntity<ApiResponse<Volunteer>> applyForVolunteer(@Valid @RequestBody VolunteerRequest request) {
        try {
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            Donor donor = donorRepository.findByEmail(email)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Donor not found"));

            Volunteer volunteer = volunteerService.apply(
                    donor.getDonorId(),
                    request.getOpportunityId(),
                    request.getMessage(),
                    request.getHoursCommitted()
            );

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Volunteer application submitted successfully", volunteer));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to submit volunteer application: " + e.getMessage()));
        }
    }

    @GetMapping("/volunteer-applications")
    public ResponseEntity<ApiResponse<List<Volunteer>>> getMyVolunteerApplications() {
        try {
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            Donor donor = donorRepository.findByEmail(email)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Donor not found"));

            List<Volunteer> applications = volunteerService.donorHistory(donor.getDonorId());
            return ResponseEntity.ok(ApiResponse.success("Volunteer applications retrieved", applications));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve volunteer applications: " + e.getMessage()));
        }
    }

    /* ─────────────────── CAMPAIGN DONATION ENDPOINTS ─────────────────── */

    @PostMapping("/campaigns/{campaignId}/donate")
    public ResponseEntity<ApiResponse<CampaignDonation>> donateToCampaign(
            @PathVariable String campaignId,
            @RequestBody Map<String, Object> donationData) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String donorEmail = authentication.getName();

            Optional<Campaign> campaignOpt = campaignRepository.findById(campaignId);
            if (campaignOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Campaign campaign = campaignOpt.get();

            // Check if campaign accepts the type of donation
            Integer donationAmount = (Integer) donationData.get("donationAmount");
            Boolean volunteerTime = (Boolean) donationData.get("volunteerTime");

            if (donationAmount != null && !campaign.isAcceptsMoney()) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("This campaign does not accept money donations"));
            }

            if (volunteerTime != null && volunteerTime && !campaign.isAcceptsTime()) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("This campaign does not accept time donations"));
            }

            // Create campaign donation
            CampaignDonation donation = new CampaignDonation(donorEmail, donationAmount, volunteerTime);

            // Update campaign totals
            if (donationAmount != null) {
                campaign.totalRaised(donationAmount);
            }
            campaign.addDonation(donation);
            campaignRepository.save(campaign);

            return ResponseEntity.ok(ApiResponse.success("Campaign donation successful", donation));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Campaign donation failed: " + e.getMessage()));
        }
    }
}
