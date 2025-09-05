// repository/VolunteerOpportunityRepository.java
package com.lab.BackEnd.repository;

import com.lab.BackEnd.model.VolunteerOpportunity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VolunteerOpportunityRepository extends MongoRepository<VolunteerOpportunity, String> {

    List<VolunteerOpportunity> findByActiveTrue();

    List<VolunteerOpportunity> findByNgoIdAndActiveTrue(String ngoId);

    List<VolunteerOpportunity> findByNgoId(String ngoId);

    List<VolunteerOpportunity> findByLinkedCampaignId(String campaignId);

    List<VolunteerOpportunity> findByLinkedCampaignIdIsNull();

    List<VolunteerOpportunity> findByLinkedCampaignIdIsNotNull();

    boolean existsByOpportunityId(String opportunityId);
}
