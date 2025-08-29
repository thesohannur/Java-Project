package com.lab.BackEnd.controller;

import com.lab.BackEnd.dto.response.ApiResponse;
import com.lab.BackEnd.model.NGO;
import com.lab.BackEnd.model.Payment;
import com.lab.BackEnd.repository.PaymentRepository;
import com.lab.BackEnd.repository.NGORepository;
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
    private NGORepository ngoRepository;
    @Autowired
    private PaymentRepository paymentRepository;

    @GetMapping("/profile")  //@Sohan // Not tested // need to be tested by using JWT
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

    @PutMapping("/profile")  //@Sohan // Not tested // need to be tested by using JWT
    public ResponseEntity<ApiResponse<NGO>> updateProfile(@RequestBody NGO updatedNgo) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        NGO ngo = ngoRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "NGO not found"));

        // Update allowed fields
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



    // Pending donation getter
    @GetMapping("/donation/{ngoId}")
    public List<Payment> getPendingDonations(@PathVariable String ngoId) {
        return paymentRepository.findByNgoId(ngoId);
    }

}