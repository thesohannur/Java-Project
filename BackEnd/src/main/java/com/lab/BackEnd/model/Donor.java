package com.lab.BackEnd.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;

@Document(collection = "donors")
public class Donor {
    @Id
    private String donorId;

    @Indexed(unique = true)
    private String email;

    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String address;
    private String occupation;
    private String profileImage;
    private Double totalDonated = 0.0;
    private LocalDateTime registrationDate = LocalDateTime.now();
    private String userId;

    public Donor() {}

    // Getters and Setters
    public String getDonorId() { return donorId; }
    public void setDonorId(String donorId) { this.donorId = donorId; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getOccupation() { return occupation; }
    public void setOccupation(String occupation) { this.occupation = occupation; }

    public String getProfileImage() { return profileImage; }
    public void setProfileImage(String profileImage) { this.profileImage = profileImage; }

    public Double getTotalDonated() { return totalDonated; }
    public void setTotalDonated(Double totalDonated) { this.totalDonated = totalDonated; }

    public LocalDateTime getRegistrationDate() { return registrationDate; }
    public void setRegistrationDate(LocalDateTime registrationDate) { this.registrationDate = registrationDate; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
}