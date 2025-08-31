package com.lab.BackEnd.controller;


import com.lab.BackEnd.model.Campaign;
import com.lab.BackEnd.repository.CampaignRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/camp")
public class CampaignController {

    @Autowired
    private CampaignRepository campaignRepository;

    @DeleteMapping("/deleteCampaign/{campaignId}")
    public ResponseEntity<?> deleteCampaign(@PathVariable String campaignId) {
        Optional<Campaign> campaignOpt = campaignRepository.findById(campaignId);

        if (campaignOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Campaign not found");
        }

        Campaign campaign = campaignOpt.get();

        if (!campaign.isManualDeletionAllowed()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Campaign cannot be deleted. Expiry date has been set.");
        }

        campaignRepository.deleteById(campaignId);
        return ResponseEntity.ok("Campaign deleted successfully.");
    }



}
