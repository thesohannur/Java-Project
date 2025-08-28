package com.lab.BackEnd.controller;

import com.lab.BackEnd.dto.response.ApiResponse;
import com.lab.BackEnd.model.Donor;
import com.lab.BackEnd.model.NGO;
import com.lab.BackEnd.model.Payment;
import com.lab.BackEnd.repository.DonorRepository;
import com.lab.BackEnd.repository.PaymentRepository;
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
    private PaymentService paymentService;
    @Autowired
    private PaymentRepository paymentRepository;

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<Donor>> getProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        Optional<Donor> donor = donorRepository.findByEmail(email);
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

        if (donor.getNgoID() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No NGO found");
        }

        boolean paymentSuccess = paymentService.processPayment();

        if (!paymentSuccess) {
            paymentRepository.save(new Payment(donor.getDonorId(), donor.getNgoID(), donor.getAmount(), "FAILED"));
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                    .body("Payment failed. Donation not processed.");
        }

        // Save payment with SUCCESS status
        //ObjectID will be its transaction ID;
        Payment payment = (new Payment(donor.getDonorId(), donor.getNgoID(), donor.getAmount(), "SUCCESS"));
        paymentRepository.save(payment);
        //Sohan nur //when user logs in a method in spring security can be created so that his user id is stored and set there
        //and in newPayment(donor.getDonorId() <-- will use it. cause user won't be sending their id everytime
        // they make donation, till then I am using json format for simplicity

        return ResponseEntity.ok("Payment successful. Donation sent for NGO approval.");
    }

    // Get donation history for a user
    @GetMapping("/user/{userId}")
    public Optional<Donor> getDonationsByUser(@PathVariable String userId) {
        return donorRepository.findByUserId(userId);
    }

}