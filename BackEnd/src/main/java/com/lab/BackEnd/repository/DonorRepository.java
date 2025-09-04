package com.lab.BackEnd.repository;

import com.lab.BackEnd.model.Donor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface DonorRepository extends MongoRepository<Donor, String> {
    
    // Basic finder methods
    Optional<Donor> findByEmail(String email);
    Optional<Donor> findByUserId(String userId);
    Optional<Donor> findByPhoneNumber(String phoneNumber);
    
    // Existence checks
    boolean existsByEmail(String email);
    boolean existsByPhoneNumber(String phoneNumber);
    boolean existsByUserId(String userId);
    
    // Status-based queries
    List<Donor> findByIsApproved(Boolean isApproved);
    List<Donor> findByIsActive(Boolean isActive);
    List<Donor> findByIsEmailVerified(Boolean isEmailVerified);
    
    // Combined status queries for dashboard
    List<Donor> findByIsApprovedAndIsActive(Boolean isApproved, Boolean isActive);
    Page<Donor> findByIsApprovedAndIsActive(Boolean isApproved, Boolean isActive, Pageable pageable);
    
    // Donation-based queries
    List<Donor> findByTotalDonatedGreaterThan(Double amount);
    List<Donor> findByTotalDonatedBetween(Double minAmount, Double maxAmount);
    
    // Top donors for dashboard
    @Query(value = "{}", sort = "{ 'total_donated' : -1 }")
    List<Donor> findTopDonors(Pageable pageable);
    
    // Recent registrations for dashboard
    List<Donor> findByRegistrationDateAfter(LocalDateTime date);
    List<Donor> findByRegistrationDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    // Search functionality for admin dashboard
    @Query("{'$or': [" +
           "{'firstName': {'$regex': ?0, '$options': 'i'}}, " +
           "{'lastName': {'$regex': ?0, '$options': 'i'}}, " +
           "{'email': {'$regex': ?0, '$options': 'i'}}" +
           "]}")
    List<Donor> searchByNameOrEmail(String searchTerm);
    
    @Query("{'$or': [" +
           "{'firstName': {'$regex': ?0, '$options': 'i'}}, " +
           "{'lastName': {'$regex': ?0, '$options': 'i'}}, " +
           "{'email': {'$regex': ?0, '$options': 'i'}}" +
           "], 'isActive': ?1}")
    Page<Donor> searchByNameOrEmailAndIsActive(String searchTerm, Boolean isActive, Pageable pageable);
    
    // Count queries for dashboard statistics
    long countByIsApproved(Boolean isApproved);
    long countByIsActive(Boolean isActive);
    long countByIsEmailVerified(Boolean isEmailVerified);
    long countByRegistrationDateAfter(LocalDateTime date);
    
    // Complex queries for dashboard analytics
    @Query("{'isApproved': true, 'isActive': true}")
    long countActiveDonors();
    
    @Query("{'isApproved': false, 'isActive': true}")
    long countPendingApproval();
    
    @Query(value = "{'isActive': true}", count = true)
    long countTotalActiveDonors();
    
    // Find donors by location (for regional analytics)
    @Query("{'address': {'$regex': ?0, '$options': 'i'}, 'isActive': true}")
    List<Donor> findByAddressContainingIgnoreCaseAndIsActive(String location);
    
    // Find donors by occupation (for demographic analytics)
    List<Donor> findByOccupationIgnoreCase(String occupation);
    List<Donor> findByOccupationContainingIgnoreCase(String occupation);
    
    // Monthly/yearly registration analytics
    @Query("{'registrationDate': {'$gte': ?0, '$lt': ?1}}")
    List<Donor> findDonorsRegisteredInPeriod(LocalDateTime startDate, LocalDateTime endDate);
    
    // Verification token queries
    Optional<Donor> findByVerificationToken(String token);
    
    // Advanced pagination with sorting for dashboard tables
    Page<Donor> findByIsActiveOrderByRegistrationDateDesc(Boolean isActive, Pageable pageable);
    Page<Donor> findByIsActiveOrderByTotalDonatedDesc(Boolean isActive, Pageable pageable);
    Page<Donor> findByIsApprovedAndIsActiveOrderByLastModifiedDateDesc(
            Boolean isApproved, Boolean isActive, Pageable pageable);
    
    // Dashboard summary queries
    @Query("{'totalDonated': {'$gt': 0}, 'isActive': true}")
    List<Donor> findActiveDonorsWithDonations();
    
    @Query("{'totalDonated': 0, 'isActive': true, 'isApproved': true}")
    List<Donor> findApprovedDonorsWithoutDonations();
    
    // Custom aggregation method for total donation statistics
    @Query(value = "{'isActive': true, 'isApproved': true}", 
           fields = "{'totalDonated': 1}")
    List<Donor> findAllActiveDonorAmounts();
}