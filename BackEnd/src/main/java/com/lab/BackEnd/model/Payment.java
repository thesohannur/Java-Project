package com.lab.BackEnd.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.UUID;


@Getter
@Setter
@Document(collection = "payments")
public class Payment {
    //object ID will be transactionID
    private String donorId;
    private String ngoId;
    private Double amount;
    private String status; // e.g. SUCCESS, FAILED
    private LocalDateTime timestamp;

    public Payment(String donorId, String ngoId, Double amount, String status) {
        this.donorId = donorId;
        this.ngoId = ngoId;
        this.amount = amount;
        this.status = status;
        this.timestamp = LocalDateTime.now();
    }

}
