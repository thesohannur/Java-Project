package com.lab.BackEnd.controller;

import com.lab.BackEnd.dto.response.ApiResponse;
import com.lab.BackEnd.model.Donor;
import com.lab.BackEnd.model.NGO;
import com.lab.BackEnd.repository.DonorRepository;
import com.lab.BackEnd.repository.ngoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/ngo")

public class NGOController {

    @Autowired
    private ngoRepository ngoRepository;
    @Autowired
    private DonorRepository donorRepository;

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

    //NGO approves donation manually
    @PostMapping("/approve/{donationId}")
    public NGO approveDonation(@PathVariable String donationId) {
        NGO ngoDonation = ngoRepository.findByDonationId(donationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Donation not found"));

        ngoDonation.setApproved(true);
        ngoRepository.save(ngoDonation);

        //Update donor as well
        Donor donation = donorRepository.findByDonationId(donationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Donation not found"));
        donation.setApproved(true);
        donorRepository.save(donation);

        return ngoDonation;
    }

    // NGO gets all pending donations for approval
    @GetMapping("/pending")
    public List<NGO> getPendingDonations() {
        return ngoRepository.findByApprovedFalse();
    }


}