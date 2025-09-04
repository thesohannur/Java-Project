package com.lab.BackEnd.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "campaign")
@Getter
@Setter
public class Campaign {
    @Id
    private String campaignId;

    private String donorId;
    private String ngoEmail;
    private LocalDateTime creationTime;
    private LocalDateTime expirationTime;
    private Integer amount;
    private Integer volunteerTime;
    private boolean approved;
    private String description;
    private boolean manualDeletionAllowed = false;
    private Integer rejectFlag;
    private String feedback;
    private Boolean pendingCheckup;

    private List<CampaignDonation> donations = new ArrayList<>();


    public Campaign() {}

    public Campaign(String email, LocalDateTime expirationTime, Integer volunteerTime, String description) {
        this.creationTime = LocalDateTime.now();
        this.ngoEmail = email;
        this.expirationTime = expirationTime;
        this.volunteerTime = volunteerTime;
        this.approved = false;
        this.description = description;
        this.rejectFlag = 0;
        this.feedback = null;
        this.pendingCheckup = false;
        this.amount = 0;
    }

    public void addDonation(CampaignDonation donation) {
        this.donations.add(donation);
    }

    public void totalRaised(Integer amount) {
        this.amount += amount;
    }
}


