package com.lab.BackEnd.controller;

import com.lab.BackEnd.dto.response.ApiResponse;
import com.lab.BackEnd.model.Donor;
import com.lab.BackEnd.model.NGO;
import com.lab.BackEnd.repository.DonorRepository;
import com.lab.BackEnd.repository.ngoRepository;
import com.lab.BackEnd.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.Optional;

@RestController
@RequestMapping("/api/donor")
// Remove @CrossOrigin - handled globally
public class DonorController {

    @Autowired
    private DonorRepository donorRepository;
    @Autowired
    private ngoRepository ngoRepository;
    @Autowired
    private PaymentService paymentService;

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<Donor>> getProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        Optional <Donor> donor = donorRepository.findByEmail(email);
        if (donor.isPresent()) {
            return ResponseEntity.ok(ApiResponse.success("Profile retrieved successfully", donor.get()));
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    @PostMapping("/donate")
    public ResponseEntity<String> donate(@RequestBody Donor donor) {

        if (donor.getAmount() == null || donor.getAmount() <= 50) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Amount must be greater than 50/-");
        }

        //Check payment
        PaymentController paymentController = new PaymentController(paymentService);
        boolean paymentSuccess = paymentController.processPayment(donor.getUserId(), donor.getAmount());

        if (!paymentSuccess) {
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                    .body("Payment failed. Donation not processed.");
        }

        //Generate unique ID and timestamp
        donor.initialize();
        donorRepository.save(donor);

        //Save in NGO collection for manual approval
        NGO ngoDonation = new NGO(donor);
        ngoRepository.save(ngoDonation);

        return ResponseEntity.ok("Payment successful. Donation sent for NGO approval.");
    }

    // Get donation history for a user
    @GetMapping("/user/{userId}")
    public Optional<Donor> getDonationsByUser(@PathVariable String userId) {
        return donorRepository.findByUserId(userId);
    }

}