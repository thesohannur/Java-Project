package com.lab.BackEnd.controller;

import com.lab.BackEnd.dto.response.ApiResponse;
import com.lab.BackEnd.model.*;
import com.lab.BackEnd.repository.CampaignRepository;
import com.lab.BackEnd.repository.NGORepository;
import com.lab.BackEnd.repository.VolunteerOpportunityRepository;
import com.lab.BackEnd.service.VolunteerOpportunityService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/public")
@CrossOrigin(origins = "*")
public class PublicController {

    private static final Logger logger = LoggerFactory.getLogger(PublicController.class);

    @Autowired
    private NGORepository ngoRepository;

    @Autowired
    private CampaignRepository campaignRepository;

    @Autowired
    private VolunteerOpportunityRepository volunteerOpportunityRepository;

    @Autowired
    private VolunteerOpportunityService volunteerOpportunityService;

    // ═══════════════════ NGO ENDPOINTS ═══════════════════

    /**
     * Get all NGOs for donor browsing with optional search and pagination
     */
    @GetMapping("/ngos")
    public ResponseEntity<ApiResponse<List<NGO>>> getAllNGOs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search) {
        try {
            logger.info("Fetching NGOs - page: {}, size: {}, search: {}", page, size, search);

            List<NGO> ngos;

            if (search != null && !search.trim().isEmpty()) {
                // Search NGOs by name or address
                ngos = ngoRepository.findByOrganizationNameContainingIgnoreCaseOrAddressContainingIgnoreCase(
                        search.trim(), search.trim());
                logger.info("Found {} NGOs matching search term: {}", ngos.size(), search);
            } else {
                // Get all NGOs with pagination
                Pageable pageable = PageRequest.of(page, size, Sort.by("registrationDate").descending());
                Page<NGO> ngoPage = ngoRepository.findAll(pageable);
                ngos = ngoPage.getContent();
                logger.info("Found {} NGOs on page {}", ngos.size(), page);
            }

            return ResponseEntity.ok(ApiResponse.success("NGOs retrieved successfully", ngos));
        } catch (Exception e) {
            logger.error("Failed to retrieve NGOs", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve NGOs: " + e.getMessage()));
        }
    }

    /**
     * Get NGO details by ID
     */
    @GetMapping("/ngos/{ngoId}")
    public ResponseEntity<ApiResponse<NGO>> getNGODetails(@PathVariable String ngoId) {
        try {
            logger.info("Fetching NGO details for ID: {}", ngoId);

            Optional<NGO> ngo = ngoRepository.findById(ngoId);
            if (ngo.isPresent()) {
                logger.info("Found NGO: {}", ngo.get().getOrganizationName());
                return ResponseEntity.ok(ApiResponse.success("NGO details retrieved", ngo.get()));
            } else {
                logger.warn("NGO not found with ID: {}", ngoId);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("Failed to retrieve NGO details for ID: {}", ngoId, e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve NGO: " + e.getMessage()));
        }
    }

    /**
     * Get verified NGOs only
     */
    @GetMapping("/ngos/verified")
    public ResponseEntity<ApiResponse<List<NGO>>> getVerifiedNGOs() {
        try {
            logger.info("Fetching verified NGOs");

            List<NGO> verifiedNGOs = ngoRepository.findByIsVerifiedTrue();
            logger.info("Found {} verified NGOs", verifiedNGOs.size());

            return ResponseEntity.ok(ApiResponse.success("Verified NGOs retrieved", verifiedNGOs));
        } catch (Exception e) {
            logger.error("Failed to retrieve verified NGOs", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve verified NGOs: " + e.getMessage()));
        }
    }

    // ═══════════════════ CAMPAIGN ENDPOINTS ═══════════════════

    /**
     * Get all active approved campaigns
     */
    @GetMapping("/campaigns/active")
    public ResponseEntity<ApiResponse<List<Campaign>>> getActiveCampaigns() {
        try {
            logger.info("Fetching active campaigns");

            // Get campaigns that are approved and not expired
            LocalDateTime now = LocalDateTime.now();
            List<Campaign> activeCampaigns = campaignRepository.findByApprovedTrue();

            // Filter out expired campaigns
            List<Campaign> filteredCampaigns = activeCampaigns.stream()
                    .filter(campaign -> campaign.getExpirationTime() == null ||
                            campaign.getExpirationTime().isAfter(now))
                    .toList();

            logger.info("Found {} active campaigns", filteredCampaigns.size());
            return ResponseEntity.ok(ApiResponse.success("Active campaigns retrieved successfully", filteredCampaigns));
        } catch (Exception e) {
            logger.error("Failed to retrieve active campaigns", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve campaigns: " + e.getMessage()));
        }
    }

    /**
     * Get campaigns that accept money donations
     */
    @GetMapping("/campaigns/money")
    public ResponseEntity<ApiResponse<List<Campaign>>> getMoneyCampaigns() {
        try {
            logger.info("Fetching campaigns accepting money donations");

            List<Campaign> moneyCampaigns = campaignRepository.findByApprovedTrueAndAcceptsMoneyTrue();

            // Filter out expired ones
            LocalDateTime now = LocalDateTime.now();
            List<Campaign> filteredCampaigns = moneyCampaigns.stream()
                    .filter(campaign -> campaign.getExpirationTime() == null ||
                            campaign.getExpirationTime().isAfter(now))
                    .toList();

            logger.info("Found {} money campaigns", filteredCampaigns.size());
            return ResponseEntity.ok(ApiResponse.success("Money campaigns retrieved", filteredCampaigns));
        } catch (Exception e) {
            logger.error("Failed to retrieve money campaigns", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve money campaigns: " + e.getMessage()));
        }
    }

    /**
     * Get campaigns that accept time donations (volunteer)
     */
    @GetMapping("/campaigns/volunteer")
    public ResponseEntity<ApiResponse<List<Campaign>>> getVolunteerCampaigns() {
        try {
            logger.info("Fetching campaigns accepting volunteer time");

            List<Campaign> timeCampaigns = campaignRepository.findByApprovedTrueAndAcceptsTimeTrue();

            // Filter out expired ones
            LocalDateTime now = LocalDateTime.now();
            List<Campaign> filteredCampaigns = timeCampaigns.stream()
                    .filter(campaign -> campaign.getExpirationTime() == null ||
                            campaign.getExpirationTime().isAfter(now))
                    .toList();

            logger.info("Found {} volunteer campaigns", filteredCampaigns.size());
            return ResponseEntity.ok(ApiResponse.success("Volunteer campaigns retrieved", filteredCampaigns));
        } catch (Exception e) {
            logger.error("Failed to retrieve volunteer campaigns", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve volunteer campaigns: " + e.getMessage()));
        }
    }

    /**
     * Get campaigns by specific NGO
     */
    @GetMapping("/ngos/{ngoId}/campaigns")
    public ResponseEntity<ApiResponse<List<Campaign>>> getCampaignsByNGO(@PathVariable String ngoId) {
        try {
            logger.info("Fetching campaigns for NGO ID: {}", ngoId);

            Optional<NGO> ngo = ngoRepository.findById(ngoId);
            if (ngo.isPresent()) {
                List<Campaign> campaigns = campaignRepository.findByNgoEmailAndApprovedTrue(ngo.get().getEmail());

                // Filter out expired campaigns
                LocalDateTime now = LocalDateTime.now();
                List<Campaign> activeCampaigns = campaigns.stream()
                        .filter(campaign -> campaign.getExpirationTime() == null ||
                                campaign.getExpirationTime().isAfter(now))
                        .toList();

                logger.info("Found {} active campaigns for NGO: {}", activeCampaigns.size(), ngo.get().getOrganizationName());
                return ResponseEntity.ok(ApiResponse.success("NGO campaigns retrieved", activeCampaigns));
            } else {
                logger.warn("NGO not found with ID: {}", ngoId);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("Failed to retrieve campaigns for NGO ID: {}", ngoId, e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve NGO campaigns: " + e.getMessage()));
        }
    }

    /**
     * Search campaigns by description
     */
    @GetMapping("/campaigns/search")
    public ResponseEntity<ApiResponse<List<Campaign>>> searchCampaigns(@RequestParam String query) {
        try {
            logger.info("Searching campaigns with query: {}", query);

            if (query == null || query.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Search query cannot be empty"));
            }

            List<Campaign> campaigns = campaignRepository.findByDescriptionContainingIgnoreCaseAndApprovedTrue(query.trim());

            // Filter out expired campaigns
            LocalDateTime now = LocalDateTime.now();
            List<Campaign> activeCampaigns = campaigns.stream()
                    .filter(campaign -> campaign.getExpirationTime() == null ||
                            campaign.getExpirationTime().isAfter(now))
                    .toList();

            logger.info("Found {} campaigns matching search query: {}", activeCampaigns.size(), query);
            return ResponseEntity.ok(ApiResponse.success("Campaign search results", activeCampaigns));
        } catch (Exception e) {
            logger.error("Failed to search campaigns with query: {}", query, e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to search campaigns: " + e.getMessage()));
        }
    }

    // ═══════════════════ VOLUNTEER OPPORTUNITY ENDPOINTS ═══════════════════

    /**
     * Get all active volunteer opportunities
     */
    @GetMapping("/volunteer-opportunities")
    public ResponseEntity<ApiResponse<List<VolunteerOpportunity>>> getActiveVolunteerOpportunities() {
        try {
            logger.info("Fetching active volunteer opportunities");

            List<VolunteerOpportunity> opportunities = volunteerOpportunityService.active();
            logger.info("Found {} active volunteer opportunities", opportunities.size());

            return ResponseEntity.ok(ApiResponse.success("Volunteer opportunities retrieved", opportunities));
        } catch (Exception e) {
            logger.error("Failed to retrieve volunteer opportunities", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve volunteer opportunities: " + e.getMessage()));
        }
    }

    /**
     * Get volunteer opportunities by NGO
     */
    @GetMapping("/ngos/{ngoId}/volunteer-opportunities")
    public ResponseEntity<ApiResponse<List<VolunteerOpportunity>>> getVolunteerOpportunitiesByNGO(@PathVariable String ngoId) {
        try {
            logger.info("Fetching volunteer opportunities for NGO ID: {}", ngoId);

            List<VolunteerOpportunity> opportunities = volunteerOpportunityRepository.findByNgoIdAndActiveTrue(ngoId);
            logger.info("Found {} volunteer opportunities for NGO ID: {}", opportunities.size(), ngoId);

            return ResponseEntity.ok(ApiResponse.success("NGO volunteer opportunities retrieved", opportunities));
        } catch (Exception e) {
            logger.error("Failed to retrieve volunteer opportunities for NGO ID: {}", ngoId, e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve volunteer opportunities: " + e.getMessage()));
        }
    }

    /**
     * Get volunteer opportunities linked to campaigns
     */
    @GetMapping("/volunteer-opportunities/campaigns")
    public ResponseEntity<ApiResponse<List<VolunteerOpportunity>>> getCampaignLinkedOpportunities() {
        try {
            logger.info("Fetching campaign-linked volunteer opportunities");

            List<VolunteerOpportunity> opportunities = volunteerOpportunityRepository.findByLinkedCampaignIdIsNotNull();

            // Filter only active ones
            List<VolunteerOpportunity> activeOpportunities = opportunities.stream()
                    .filter(VolunteerOpportunity::isActive)
                    .toList();

            logger.info("Found {} campaign-linked volunteer opportunities", activeOpportunities.size());
            return ResponseEntity.ok(ApiResponse.success("Campaign-linked opportunities retrieved", activeOpportunities));
        } catch (Exception e) {
            logger.error("Failed to retrieve campaign-linked volunteer opportunities", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve campaign-linked opportunities: " + e.getMessage()));
        }
    }

    /**
     * Get standalone volunteer opportunities (not linked to campaigns)
     */
    @GetMapping("/volunteer-opportunities/standalone")
    public ResponseEntity<ApiResponse<List<VolunteerOpportunity>>> getStandaloneOpportunities() {
        try {
            logger.info("Fetching standalone volunteer opportunities");

            List<VolunteerOpportunity> opportunities = volunteerOpportunityRepository.findByLinkedCampaignIdIsNull();

            // Filter only active ones
            List<VolunteerOpportunity> activeOpportunities = opportunities.stream()
                    .filter(VolunteerOpportunity::isActive)
                    .toList();

            logger.info("Found {} standalone volunteer opportunities", activeOpportunities.size());
            return ResponseEntity.ok(ApiResponse.success("Standalone opportunities retrieved", activeOpportunities));
        } catch (Exception e) {
            logger.error("Failed to retrieve standalone volunteer opportunities", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve standalone opportunities: " + e.getMessage()));
        }
    }

    /**
     * Get volunteer opportunity details by ID
     */
    @GetMapping("/volunteer-opportunities/{opportunityId}")
    public ResponseEntity<ApiResponse<VolunteerOpportunity>> getVolunteerOpportunityDetails(@PathVariable String opportunityId) {
        try {
            logger.info("Fetching volunteer opportunity details for ID: {}", opportunityId);

            Optional<VolunteerOpportunity> opportunity = volunteerOpportunityRepository.findById(opportunityId);
            if (opportunity.isPresent()) {
                logger.info("Found volunteer opportunity: {}", opportunity.get().getTitle());
                return ResponseEntity.ok(ApiResponse.success("Volunteer opportunity details retrieved", opportunity.get()));
            } else {
                logger.warn("Volunteer opportunity not found with ID: {}", opportunityId);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("Failed to retrieve volunteer opportunity details for ID: {}", opportunityId, e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve volunteer opportunity: " + e.getMessage()));
        }
    }

    // ═══════════════════ STATISTICS ENDPOINTS ═══════════════════

    /**
     * Get public statistics
     */
    @GetMapping("/statistics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getPublicStatistics() {
        try {
            logger.info("Fetching public statistics");

            // Count totals
            long ngoCount = ngoRepository.count();
            long verifiedNgoCount = ngoRepository.findByIsVerifiedTrue().size();
            long campaignCount = campaignRepository.findByApprovedTrue().size();
            long opportunityCount = volunteerOpportunityRepository.findByActiveTrue().size();

            // Create statistics map - FIXED: Use Map instead of anonymous object
            Map<String, Object> statistics = new HashMap<>();
            statistics.put("totalNGOs", ngoCount);
            statistics.put("verifiedNGOs", verifiedNgoCount);
            statistics.put("activeCampaigns", campaignCount);
            statistics.put("activeVolunteerOpportunities", opportunityCount);

            logger.info("Statistics: {} NGOs, {} verified, {} campaigns, {} opportunities",
                    ngoCount, verifiedNgoCount, campaignCount, opportunityCount);

            return ResponseEntity.ok(ApiResponse.success("Public statistics retrieved", statistics));
        } catch (Exception e) {
            logger.error("Failed to retrieve public statistics", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve statistics: " + e.getMessage()));
        }
    }
}
