// repository/VolunteerRepository.java
package com.lab.BackEnd.repository;

import com.lab.BackEnd.model.Volunteer;
import com.lab.BackEnd.model.enums.VolunteerStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface VolunteerRepository
        extends MongoRepository<Volunteer, String> {
    List<Volunteer> findByDonorId(String donorId);
    List<Volunteer> findByNgoId(String ngoId);
    boolean existsByDonorIdAndOpportunityIdAndStatusNot(
            String donor, String opp, VolunteerStatus status);
}
