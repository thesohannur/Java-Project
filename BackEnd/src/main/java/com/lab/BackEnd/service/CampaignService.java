package com.lab.BackEnd.service;

import com.lab.BackEnd.model.Campaign;
import com.lab.BackEnd.repository.CampaignRepository;
import org.apache.catalina.util.ErrorPageSupport;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;

import java.time.LocalDateTime;
import java.util.List;

public class CampaignService {
    @Autowired
    private CampaignRepository campaignRepository;
    // Runs every day at midnight (server time)
    @Scheduled(cron = "0 0 0 * * ?")
    public void deleteExpiredCampaigns() { //we are not running through postman that's why public void
        List<Campaign> campaigns = campaignRepository.findAll();

        for (Campaign campaign : campaigns) {
            if (campaign.getExpirationTime() != null && LocalDateTime.now().isAfter(campaign.getExpirationTime())) {
                campaignRepository.delete(campaign);
                System.out.println("Deleted expired campaign: " + campaign.getDescription());
            }
        }
    }
}
