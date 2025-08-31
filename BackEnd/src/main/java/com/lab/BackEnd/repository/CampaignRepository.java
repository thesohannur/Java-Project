package com.lab.BackEnd.repository;

import com.lab.BackEnd.model.Campaign;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CampaignRepository extends MongoRepository<Campaign, String> {
    List<Campaign> findByNgoEmail(String ngoEmail);
    List<Campaign> findByApproved(Boolean approved);
}
