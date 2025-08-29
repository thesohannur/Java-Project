package com.lab.BackEnd.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "campaign")
@Getter
@Setter
public class Campaign {
    @Id
    private String campaignId;

    private String donorId;
    private String ngoId;
    private LocalDateTime creationTime;
    private LocalDateTime expirationTime;
    private Integer amount;
    private Integer volunteerTime;
    private boolean approved;
    private String description;
    private boolean manualDeletionAllowed = false;

    public Campaign() {}

    public Campaign(String ngoId, String expirationDays, Integer volunteerTime, String description) {
        this.creationTime = LocalDateTime.now();
        this.ngoId = ngoId;

        if (expirationDays == null || expirationDays.isEmpty() || expirationDays.equals("0")) {
            this.expirationTime = null; // means no auto-expiry
            this.manualDeletionAllowed = true;
        } else {
            int days = Integer.parseInt(expirationDays);
            this.expirationTime = LocalDateTime.now().plusDays(days);
        }

        this.volunteerTime = volunteerTime;
        this.approved = false;
        this.description = description;
    }
}


