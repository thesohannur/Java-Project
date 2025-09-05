// service/VolunteerOpportunityService.java
package com.lab.BackEnd.service;

import com.lab.BackEnd.model.VolunteerOpportunity;
import com.lab.BackEnd.repository.VolunteerOpportunityRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class VolunteerOpportunityService {

    private static final Logger logger = LoggerFactory.getLogger(VolunteerOpportunityService.class);

    @Autowired
    private VolunteerOpportunityRepository repo;

    public VolunteerOpportunity create(VolunteerOpportunity vo) {
        try {
            logger.info("Creating volunteer opportunity: {}", vo.getTitle());

            // Validate required fields
            if (vo.getTitle() == null || vo.getTitle().trim().isEmpty()) {
                throw new IllegalArgumentException("Title is required");
            }

            if (vo.getDescription() == null || vo.getDescription().trim().isEmpty()) {
                throw new IllegalArgumentException("Description is required");
            }

            if (vo.getNgoId() == null || vo.getNgoId().trim().isEmpty()) {
                throw new IllegalArgumentException("NGO ID is required");
            }

            // Set default values if not provided
            if (vo.getMaxVolunteers() == null || vo.getMaxVolunteers() < 1) {
                vo.setMaxVolunteers(1);
            }

            if (vo.getCurrentVolunteers() == null) {
                vo.setCurrentVolunteers(0);
            }

            // Ensure creation time is set
            if (vo.getCreatedAt() == null) {
                vo.setCreatedAt(LocalDateTime.now());
            }

            // Validate date logic
            if (vo.getStartDate() != null && vo.getEndDate() != null) {
                if (vo.getEndDate().isBefore(vo.getStartDate())) {
                    throw new IllegalArgumentException("End date cannot be before start date");
                }
            }

            VolunteerOpportunity saved = repo.save(vo);
            logger.info("Successfully created volunteer opportunity with ID: {}", saved.getOpportunityId());

            return saved;
        } catch (Exception e) {
            logger.error("Failed to create volunteer opportunity: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to create volunteer opportunity: " + e.getMessage(), e);
        }
    }

    public List<VolunteerOpportunity> active() {
        return repo.findByActiveTrue();
    }

    public List<VolunteerOpportunity> ofNgo(String ngoId) {
        if (ngoId == null || ngoId.trim().isEmpty()) {
            throw new IllegalArgumentException("NGO ID cannot be null or empty");
        }
        return repo.findByNgoIdAndActiveTrue(ngoId);
    }

    public void close(String id) {
        try {
            repo.findById(id).ifPresent(vo -> {
                vo.setActive(false);
                repo.save(vo);
                logger.info("Closed volunteer opportunity: {}", id);
            });
        } catch (Exception e) {
            logger.error("Failed to close volunteer opportunity {}: {}", id, e.getMessage(), e);
            throw new RuntimeException("Failed to close volunteer opportunity: " + e.getMessage(), e);
        }
    }
}
