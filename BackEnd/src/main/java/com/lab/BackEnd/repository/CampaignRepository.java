package com.lab.BackEnd.repository;

import com.lab.BackEnd.model.Campaign;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CampaignRepository extends MongoRepository<Campaign, String> {

    // Your existing methods
    List<Campaign> findByNgoEmail(String ngoEmail);
    List<Campaign> findByApproved(Boolean approved);
    List<Campaign> findByApprovedFalseAndPendingCheckupFalse();

    // New methods for donor functionality
    List<Campaign> findByApprovedTrue();
    List<Campaign> findByApprovedTrueAndAcceptsMoneyTrue();
    List<Campaign> findByApprovedTrueAndAcceptsTimeTrue();
    List<Campaign> findByNgoEmailAndApprovedTrue(String ngoEmail);
    List<Campaign> findByDescriptionContainingIgnoreCaseAndApprovedTrue(String searchTerm);
    List<Campaign> findByApprovedTrueAndExpirationTimeAfter(LocalDateTime currentTime);
    List<Campaign> findByApprovedTrueAndExpirationTimeIsNull();

    // Combined queries for active campaigns
    default List<Campaign> findActiveCampaigns() {
        LocalDateTime now = LocalDateTime.now();
        List<Campaign> withExpiry = findByApprovedTrueAndExpirationTimeAfter(now);
        List<Campaign> noExpiry = findByApprovedTrueAndExpirationTimeIsNull();
        withExpiry.addAll(noExpiry);
        return withExpiry;
    }
}
