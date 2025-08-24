package com.lab.BackEnd.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "ngos")
@Getter
@Setter
public class NGO {
    @Id
    private String ngoId;

    @Indexed(unique = true)
    private String email;

    @Indexed(unique = true)
    private String registrationNumber;

    private String organizationName;
    private String contactPerson;
    private String phoneNumber;
    private String address;
    private String website;
    private String description;
    private List<String> focusAreas;
    private String logo;
    private boolean isVerified = false;
    private Double totalReceived = 0.0;
    private LocalDateTime registrationDate = LocalDateTime.now();
    private String userId;
    private double amount;
    private LocalDateTime createdAt;
    private boolean approved = false;
    private String donationId;

    public NGO() {}

    public NGO(Donor donor) {
        this.donationId = donor.getDonationId();
        this.userId = donor.getUserId();
        this.amount = donor.getAmount();
        this.createdAt = donor.getCreatedAt();
        this.approved = false;
    }
}