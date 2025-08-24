package com.lab.BackEnd.model;

import com.fasterxml.jackson.annotation.JsonAnyGetter;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;

@Document(collection = "donors")
@Getter
@Setter
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
    private Double amount;

    public Donor() {}

}