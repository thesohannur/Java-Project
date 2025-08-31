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

    @GetMapping("/allUnApproved") //endpoint for admin to see all the approved campaigns
    public ResponseEntity<List<Campaign>> getAllUnapprovedCampaigns() {
        List<Campaign> campaigns = campaignRepository.findByApproved(false);
        if (campaigns.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(campaigns);
    }

}
