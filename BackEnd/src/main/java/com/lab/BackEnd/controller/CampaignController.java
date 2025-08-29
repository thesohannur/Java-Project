package com.lab.BackEnd.controller;


import com.lab.BackEnd.model.Campaign;
import com.lab.BackEnd.model.Donor;
import com.lab.BackEnd.repository.CampaignRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/camp")
public class CampaignController {

    @Autowired
    private CampaignRepository campaignRepository;

    @PostMapping("/create")
    public ResponseEntity<?> createCampaign(@RequestBody Campaign campBody) {
        if (campBody.getDescription() == null || campBody.getDescription().length() < 10) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Minimum description length is 10 characters.");
        }


        // Create and save
        Campaign campaign = new Campaign(
                campBody.getNgoId(),
                campBody.getExpirationTime() != null ? campBody.getExpirationTime().toString() : "0",
                campBody.getVolunteerTime(),
                campBody.getDescription()
        );

        Campaign savedCampaign = campaignRepository.save(campaign);
        return ResponseEntity.ok(savedCampaign);
    }

    @GetMapping("/ngo/{ngoId}")
    public ResponseEntity<List<Campaign>> getCampaignsByNgo(@PathVariable String ngoId) {
        List<Campaign> campaigns = campaignRepository.findByNgoId(ngoId);
        if (campaigns.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(campaigns);
    }

    @PutMapping("/update/{campaignId}")
    public ResponseEntity<?> updateCampaign(@PathVariable String campaignId, @RequestBody Campaign updatedData) {
        Optional<Campaign> existingOpt = campaignRepository.findById(campaignId);
        if (existingOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Campaign not found");
        }

        Campaign existing = existingOpt.get();

        if (updatedData.getVolunteerTime() != null) {
            existing.setVolunteerTime(updatedData.getVolunteerTime());
        }

        if (updatedData.getExpirationTime() != null) {
            existing.setExpirationTime(updatedData.getExpirationTime()); // Expecting Promittee (frontend) to send proper ISO date
            existing.setManualDeletionAllowed(false); // reset that means cannot be deleted manually
        } else {
            existing.setExpirationTime(null);
            existing.setManualDeletionAllowed(true);
        }

        Campaign saved = campaignRepository.save(existing);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/delete/{campaignId}")
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

    @GetMapping("/all") //endpoint for donor to see all the campaigns
    public ResponseEntity<List<Campaign>> getAllCampaigns() {
        List<Campaign> campaigns = campaignRepository.findAll();
        if (campaigns.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(campaigns);
    }

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
