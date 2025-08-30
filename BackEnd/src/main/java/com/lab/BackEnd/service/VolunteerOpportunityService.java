// service/VolunteerOpportunityService.java
package com.lab.BackEnd.service;

import com.lab.BackEnd.model.VolunteerOpportunity;
import com.lab.BackEnd.repository.VolunteerOpportunityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class VolunteerOpportunityService {
    @Autowired private VolunteerOpportunityRepository repo;

    public VolunteerOpportunity create(VolunteerOpportunity vo) {
        return repo.save(vo);
    }
    public List<VolunteerOpportunity> active() { return repo.findByActiveTrue(); }
    public List<VolunteerOpportunity> ofNgo(String ngoId) { return repo.findByNgoIdAndActiveTrue(ngoId); }
    public void close(String id) {
        repo.findById(id).ifPresent(vo -> { vo.setActive(false); repo.save(vo); });
    }
}
