// service/VolunteerService.java
package com.lab.BackEnd.service;

import com.lab.BackEnd.model.Volunteer;
import com.lab.BackEnd.model.VolunteerOpportunity;
import com.lab.BackEnd.model.enums.VolunteerStatus;
import com.lab.BackEnd.repository.VolunteerOpportunityRepository;
import com.lab.BackEnd.repository.VolunteerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class VolunteerService {

    @Autowired private VolunteerRepository volRepo;
    @Autowired private VolunteerOpportunityRepository oppRepo;

    public Volunteer apply(String donorId, String oppId,
                           String message, Integer hours) {

        if (volRepo.existsByDonorIdAndOpportunityIdAndStatusNot(
                donorId, oppId, VolunteerStatus.REJECTED))
            throw new RuntimeException("Already applied");

        VolunteerOpportunity opp = oppRepo.findById(oppId)
                .orElseThrow(() -> new RuntimeException("Opportunity not found"));

        if (!opp.isActive() || opp.getCurrentVolunteers() >= opp.getMaxVolunteers())
            throw new RuntimeException("Slots filled");

        Volunteer v = new Volunteer();
        v.setDonorId(donorId);
        v.setOpportunityId(oppId);
        v.setNgoId(opp.getNgoId());
        v.setDonorMessage(message);
        v.setHoursCommitted(hours);
        return volRepo.save(v);
    }

    public Volunteer approve(String volunteerId, String ngoId) {
        Volunteer v = volRepo.findById(volunteerId)
                .orElseThrow(() -> new RuntimeException("Volunteer not found"));

        if (!v.getNgoId().equals(ngoId) || v.getStatus() != VolunteerStatus.PENDING)
            throw new RuntimeException("Not authorized");

        v.setStatus(VolunteerStatus.APPROVED);
        volRepo.save(v);

        oppRepo.findById(v.getOpportunityId()).ifPresent(opp -> {
            opp.setCurrentVolunteers(opp.getCurrentVolunteers() + 1);
            oppRepo.save(opp);
        });
        return v;
    }

    public Volunteer complete(String volunteerId, int hoursDone) {
        Volunteer v = volRepo.findById(volunteerId)
                .orElseThrow(() -> new RuntimeException("Volunteer not found"));
        v.setStatus(VolunteerStatus.COMPLETED);
        v.setHoursCompleted(hoursDone);
        v.setCompletedDate(LocalDateTime.now());
        return volRepo.save(v);
    }

    public List<Volunteer> donorHistory(String donorId) { return volRepo.findByDonorId(donorId); }
    public List<Volunteer> ngoVols(String ngoId) { return volRepo.findByNgoId(ngoId); }
}
