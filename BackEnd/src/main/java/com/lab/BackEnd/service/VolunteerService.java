// service/VolunteerService.java
package com.lab.BackEnd.service;

import com.lab.BackEnd.model.Volunteer;
import com.lab.BackEnd.model.VolunteerOpportunity;
import com.lab.BackEnd.model.enums.VolunteerStatus;
import com.lab.BackEnd.repository.VolunteerOpportunityRepository;
import com.lab.BackEnd.repository.VolunteerRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class VolunteerService {

    private static final Logger logger = LoggerFactory.getLogger(VolunteerService.class);

    @Autowired
    private VolunteerRepository volRepo;

    @Autowired
    private VolunteerOpportunityRepository oppRepo;

    public Volunteer apply(String donorId, String oppId, String message, Integer hours) {
        try {
            logger.info("Processing volunteer application: donorId={}, opportunityId={}", donorId, oppId);

            if (volRepo.existsByDonorIdAndOpportunityIdAndStatusNot(donorId, oppId, VolunteerStatus.REJECTED)) {
                throw new RuntimeException("Already applied to this opportunity");
            }

            VolunteerOpportunity opp = oppRepo.findById(oppId)
                    .orElseThrow(() -> new RuntimeException("Opportunity not found"));

            if (!opp.isActive()) {
                throw new RuntimeException("This opportunity is no longer active");
            }

            if (opp.getCurrentVolunteers() >= opp.getMaxVolunteers()) {
                throw new RuntimeException("No available slots for this opportunity");
            }

            Volunteer v = new Volunteer();
            v.setDonorId(donorId);
            v.setOpportunityId(oppId);
            v.setNgoId(opp.getNgoId());
            v.setDonorMessage(message);
            v.setHoursCommitted(hours);
            v.setApplicationDate(LocalDateTime.now());
            v.setStatus(VolunteerStatus.PENDING);

            Volunteer saved = volRepo.save(v);
            logger.info("Successfully created volunteer application with ID: {}", saved.getVolunteerId());

            return saved;
        } catch (Exception e) {
            logger.error("Failed to process volunteer application: {}", e.getMessage(), e);
            throw e;
        }
    }

    public Volunteer approve(String volunteerId, String ngoId) {
        try {
            logger.info("Approving volunteer: volunteerId={}, ngoId={}", volunteerId, ngoId);

            Volunteer v = volRepo.findById(volunteerId)
                    .orElseThrow(() -> new RuntimeException("Volunteer application not found"));

            if (!v.getNgoId().equals(ngoId)) {
                throw new RuntimeException("Not authorized to approve this volunteer application");
            }

            if (v.getStatus() != VolunteerStatus.PENDING) {
                throw new RuntimeException("Volunteer application is not in pending status");
            }

            v.setStatus(VolunteerStatus.APPROVED);
            Volunteer saved = volRepo.save(v);

            // Update opportunity current volunteers count
            oppRepo.findById(v.getOpportunityId()).ifPresent(opp -> {
                opp.setCurrentVolunteers(opp.getCurrentVolunteers() + 1);
                oppRepo.save(opp);
            });

            logger.info("Successfully approved volunteer: {}", volunteerId);
            return saved;
        } catch (Exception e) {
            logger.error("Failed to approve volunteer {}: {}", volunteerId, e.getMessage(), e);
            throw e;
        }
    }

    public Volunteer complete(String volunteerId, int hoursDone) {
        try {
            logger.info("Completing volunteer work: volunteerId={}, hours={}", volunteerId, hoursDone);

            Volunteer v = volRepo.findById(volunteerId)
                    .orElseThrow(() -> new RuntimeException("Volunteer application not found"));

            if (v.getStatus() != VolunteerStatus.APPROVED) {
                throw new RuntimeException("Volunteer must be approved before completion");
            }

            v.setStatus(VolunteerStatus.COMPLETED);
            v.setHoursCompleted(hoursDone);
            v.setCompletedDate(LocalDateTime.now());

            Volunteer saved = volRepo.save(v);
            logger.info("Successfully completed volunteer work: {}", volunteerId);

            return saved;
        } catch (Exception e) {
            logger.error("Failed to complete volunteer work {}: {}", volunteerId, e.getMessage(), e);
            throw e;
        }
    }

    public List<Volunteer> donorHistory(String donorId) {
        return volRepo.findByDonorId(donorId);
    }

    public List<Volunteer> ngoVols(String ngoId) {
        return volRepo.findByNgoId(ngoId);
    }
}
