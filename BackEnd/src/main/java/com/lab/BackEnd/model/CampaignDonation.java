package com.lab.BackEnd.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CampaignDonation {
    private String donorEmail;
    private Integer donationAmount;
    private Boolean volunteerTime;
}
