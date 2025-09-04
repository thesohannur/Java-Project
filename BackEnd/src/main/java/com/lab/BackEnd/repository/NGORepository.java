package com.lab.BackEnd.repository;

import com.lab.BackEnd.model.NGO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface NGORepository extends MongoRepository<NGO, String> {
    
    // Basic finder methods
    Optional<NGO> findByEmail(String email);
    Optional<NGO> findByUserId(String userId);
    Optional<NGO> findByRegistrationNumber(String registrationNumber);
    Optional<NGO> findByNgoId(String ngoId);
    
    // Existence checks
    boolean existsByEmail(String email);
    boolean existsByRegistrationNumber(String registrationNumber);
    boolean existsByNgoId(String ngoId);
    
    // Status-based queries - Fixed to match model field names
    List<NGO> findByStatus(String status);
    List<NGO> findByIsVerified(Boolean isVerified);
    List<NGO> findByVerificationStatus(String verificationStatus);
    
    // Paginated status queries for better performance
    Page<NGO> findByStatus(String status, Pageable pageable);
    Page<NGO> findByIsVerified(Boolean isVerified, Pageable pageable);
    Page<NGO> findByVerificationStatus(String verificationStatus, Pageable pageable);
    
    // Performance-based queries with null safety
    @Query("{'totalReceived': {$gt: ?0}}")
    List<NGO> findByTotalReceivedGreaterThan(Double amount);
    
    @Query("{'totalDonors': {$gt: ?0}}")
    List<NGO> findByTotalDonorsGreaterThan(Integer donorCount);
    
    @Query("{'activeCampaigns': {$gt: ?0}}")
    List<NGO> findByActiveCampaignsGreaterThan(Integer campaignCount);
    
    // Location-based queries
    List<NGO> findByCountry(String country);
    List<NGO> findByState(String state);
    List<NGO> findByCity(String city);
    List<NGO> findByCountryAndState(String country, String state);
    
    // Paginated location queries
    Page<NGO> findByCountry(String country, Pageable pageable);
    Page<NGO> findByState(String state, Pageable pageable);
    Page<NGO> findByCity(String city, Pageable pageable);
    
    // Focus area queries
    @Query("{'focusAreas': {$in: [?0]}}")
    List<NGO> findByFocusAreasContaining(String focusArea);
    
    @Query("{'focusAreas': {$in: ?0}}")
    List<NGO> findByFocusAreasIn(List<String> focusAreas);
    
    // Date-based queries
    List<NGO> findByRegistrationDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    List<NGO> findByRegistrationDateAfter(LocalDateTime date);
    List<NGO> findByRegistrationDateBefore(LocalDateTime date);
    List<NGO> findByLastVerificationDateBefore(LocalDateTime date);
    List<NGO> findByLastModifiedDateAfter(LocalDateTime date);
    
    // Search and filtering methods with improved regex
    @Query("{'organizationName': {$regex: ?0, $options: 'i'}}")
    List<NGO> findByOrganizationNameContainingIgnoreCase(String name);
    
    @Query("{'$text': {$search: ?0}}")
    List<NGO> findByTextSearch(String searchTerm);
    
    @Query("{'$or': [" +
           "{'organizationName': {$regex: ?0, $options: 'i'}}, " +
           "{'description': {$regex: ?0, $options: 'i'}}, " +
           "{'focusAreas': {$elemMatch: {$regex: ?0, $options: 'i'}}}, " +
           "{'contactPerson': {$regex: ?0, $options: 'i'}}" +
           "]}")
    List<NGO> searchNGOs(String searchTerm);
    
    // Paginated search for better performance
    @Query("{'$or': [" +
           "{'organizationName': {$regex: ?0, $options: 'i'}}, " +
           "{'description': {$regex: ?0, $options: 'i'}}, " +
           "{'focusAreas': {$elemMatch: {$regex: ?0, $options: 'i'}}}" +
           "]}")
    Page<NGO> searchNGOs(String searchTerm, Pageable pageable);
    
    // Top performers for dashboard analytics with limits
    @Query(value = "{'status': 'ACTIVE'}", sort = "{'totalReceived': -1}")
    List<NGO> findTop10ByOrderByTotalReceivedDesc(Pageable pageable);
    
    @Query(value = "{'status': 'ACTIVE'}", sort = "{'totalDonors': -1}")
    List<NGO> findTop10ByOrderByTotalDonorsDesc(Pageable pageable);
    
    @Query(value = "{'status': 'ACTIVE'}", sort = "{'impactScore': -1}")
    List<NGO> findTop10ByOrderByImpactScoreDesc(Pageable pageable);
    
    @Query(value = "{'status': 'ACTIVE'}", sort = "{'averageRating': -1}")
    List<NGO> findTop10ByOrderByAverageRatingDesc(Pageable pageable);
    
    // Recent registrations with limit
    @Query(value = "{}", sort = "{'registrationDate': -1}")
    List<NGO> findRecentRegistrations(Pageable pageable);
    
    // Verification queries
    @Query("{'verificationStatus': 'PENDING'}")
    List<NGO> findPendingVerificationNGOs();
    
    @Query("{'verificationStatus': 'PENDING'}")
    Page<NGO> findPendingVerificationNGOs(Pageable pageable);
    
    @Query("{'verificationStatus': 'UNDER_REVIEW'}")
    List<NGO> findUnderReviewNGOs();
    
    // Active NGOs with campaigns
    @Query("{'status': 'ACTIVE', 'activeCampaigns': {$gt: 0}}")
    List<NGO> findActiveNGOsWithCampaigns();
    
    @Query("{'status': 'ACTIVE', 'activeCampaigns': {$gt: 0}}")
    Page<NGO> findActiveNGOsWithCampaigns(Pageable pageable);
    
    // NGOs needing attention (improved query)
    @Query("{'status': 'ACTIVE', '$or': [" +
           "{'$and': [{'monthlyGoal': {$gt: 0}}, {'currentMonthReceived': {$lt: ?0}}]}, " +
           "{'totalDonors': {$lt: ?1}}, " +
           "{'activeCampaigns': {$eq: 0}}" +
           "]}")
    List<NGO> findNGOsNeedingAttention(Double minMonthlyAmount, Integer minDonors);
    
    // Goal achievement tracking
    @Query("{'monthlyGoal': {$gt: 0}, '$expr': {$gte: ['$currentMonthReceived', '$monthlyGoal']}}")
    List<NGO> findNGOsAchievingMonthlyGoal();
    
    @Query("{'monthlyGoal': {$gt: 0}, '$expr': {$lt: ['$currentMonthReceived', '$monthlyGoal']}}")
    List<NGO> findNGOsBelowMonthlyGoal();
    
    @Query("{'monthlyGoal': {$gt: 0}, '$expr': {$gte: [{'$multiply': ['$currentMonthReceived', 100]}, {'$multiply': ['$monthlyGoal', ?0]}]}}")
    List<NGO> findNGOsWithGoalProgressAbove(Double percentage);
    
    // Bank details verification
    @Query("{'$and': [" +
           "{'bankAccountNumber': {$exists: true, $ne: null, $ne: ''}}, " +
           "{'bankName': {$exists: true, $ne: null, $ne: ''}}" +
           "]}")
    List<NGO> findNGOsWithBankDetails();
    
    @Query("{'$or': [" +
           "{'bankAccountNumber': {$exists: false}}, " +
           "{'bankAccountNumber': null}, " +
           "{'bankAccountNumber': ''}, " +
           "{'bankName': {$exists: false}}, " +
           "{'bankName': null}, " +
           "{'bankName': ''}" +
           "]}")
    List<NGO> findNGOsWithoutBankDetails();
    
    // Social media presence
    @Query("{'$or': [" +
           "{'facebookUrl': {$exists: true, $ne: null, $ne: ''}}, " +
           "{'twitterUrl': {$exists: true, $ne: null, $ne: ''}}, " +
           "{'linkedinUrl': {$exists: true, $ne: null, $ne: ''}}, " +
           "{'instagramUrl': {$exists: true, $ne: null, $ne: ''}}" +
           "]}")
    List<NGO> findNGOsWithSocialMedia();
    
    // Notification preferences - Fixed to match Boolean fields
    @Query("{'emailNotifications': ?0}")
    List<NGO> findByEmailNotifications(Boolean emailNotifications);
    
    @Query("{'smsNotifications': ?0}")
    List<NGO> findBySmsNotifications(Boolean smsNotifications);
    
    // Organization type queries
    List<NGO> findByOrganizationType(String organizationType);
    List<NGO> findByPrimaryCategory(String primaryCategory);
    
    // Subscription queries
    List<NGO> findBySubscriptionPlan(String subscriptionPlan);
    
    @Query("{'subscriptionExpiry': {$lt: ?0}}")
    List<NGO> findBySubscriptionExpiredBefore(LocalDateTime date);
    
    // Rating queries
    @Query("{'averageRating': {$gte: ?0}}")
    List<NGO> findByAverageRatingGreaterThanEqual(Double rating);
    
    @Query("{'totalReviews': {$gte: ?0}}")
    List<NGO> findByTotalReviewsGreaterThanEqual(Integer reviews);
    
    // Custom aggregation queries for dashboard statistics
    @Query(value = "{'status': 'ACTIVE'}", count = true)
    long countActiveNGOs();
    
    @Query(value = "{'isVerified': true}", count = true)
    long countVerifiedNGOs();
    
    @Query(value = "{'verificationStatus': 'PENDING'}", count = true)
    long countPendingVerificationNGOs();
    
    @Query(value = "{'verificationStatus': 'VERIFIED'}", count = true)
    long countFullyVerifiedNGOs();
    
    @Query(value = "{'status': 'ACTIVE', 'isVerified': true}", count = true)
    long countActiveVerifiedNGOs();
    
    // Complex dashboard queries
    @Query("{'registrationDate': {$gte: ?0, $lte: ?1}}")
    List<NGO> findNGOsRegisteredInDateRange(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("{'status': ?0, 'country': ?1}")
    List<NGO> findByStatusAndCountry(String status, String country);
    
    @Query("{'focusAreas': {$in: ?0}, 'isVerified': true, 'status': 'ACTIVE'}")
    List<NGO> findVerifiedActiveNGOsByFocusAreas(List<String> focusAreas);
    
    @Query("{'country': ?0, 'state': ?1, 'status': 'ACTIVE'}")
    List<NGO> findActiveNGOsByLocation(String country, String state);
    
    // Advanced analytics queries
    @Query("{'establishmentYear': {$gte: ?0, $lte: ?1}}")
    List<NGO> findByEstablishmentYearBetween(Integer startYear, Integer endYear);
    
    @Query("{'teamSize': {$gte: ?0}}")
    List<NGO> findByTeamSizeGreaterThanEqual(Integer teamSize);
    
    @Query("{'beneficiariesReached': {$gte: ?0}}")
    List<NGO> findByBeneficiariesReachedGreaterThanEqual(Integer beneficiaries);
    
    // Account security queries
    @Query("{'failedLoginAttempts': {$gte: ?0}}")
    List<NGO> findByFailedLoginAttemptsGreaterThanEqual(Integer attempts);
    
    @Query("{'accountLockedUntil': {$gt: ?0}}")
    List<NGO> findLockedAccounts(LocalDateTime currentTime);
    
    @Query("{'lastLoginDate': {$lt: ?0}}")
    List<NGO> findInactiveAccounts(LocalDateTime cutoffDate);
    
    // Aggregation queries for advanced analytics
    @Aggregation(pipeline = {
        "{ $match: { 'status': 'ACTIVE', 'isVerified': true } }",
        "{ $group: { _id: '$country', count: { $sum: 1 }, totalReceived: { $sum: '$totalReceived' } } }",
        "{ $sort: { count: -1 } }"
    })
    List<Object> getVerifiedNGOStatsByCountry();
    
    @Aggregation(pipeline = {
        "{ $match: { 'status': 'ACTIVE' } }",
        "{ $unwind: '$focusAreas' }",
        "{ $group: { _id: '$focusAreas', count: { $sum: 1 } } }",
        "{ $sort: { count: -1 } }"
    })
    List<Object> getFocusAreaStatistics();
    
    @Aggregation(pipeline = {
        "{ $match: { 'monthlyGoal': { $gt: 0 } } }",
        "{ $addFields: { goalProgress: { $divide: ['$currentMonthReceived', '$monthlyGoal'] } } }",
        "{ $match: { goalProgress: { $gte: ?0 } } }",
        "{ $sort: { goalProgress: -1 } }"
    })
    List<NGO> findNGOsByGoalProgressAbove(Double progressThreshold);
    
    // Custom update queries (if needed)
    @Query("{'email': ?0}")
    Optional<NGO> findByEmailForUpdate(String email);
    
    @Query("{'ngoId': ?0}")
    Optional<NGO> findByNgoIdForUpdate(String ngoId);
}
