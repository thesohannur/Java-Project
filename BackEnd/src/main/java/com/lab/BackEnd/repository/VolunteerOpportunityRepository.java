// repository/VolunteerOpportunityRepository.java
package com.lab.BackEnd.repository;

import com.lab.BackEnd.model.VolunteerOpportunity;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface VolunteerOpportunityRepository
        extends MongoRepository<VolunteerOpportunity, String> {
    List<VolunteerOpportunity> findByActiveTrue();
    List<VolunteerOpportunity> findByNgoIdAndActiveTrue(String ngoId);
}
