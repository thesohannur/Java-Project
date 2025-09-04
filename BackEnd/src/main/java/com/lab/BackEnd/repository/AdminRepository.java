package com.lab.BackEnd.repository;

import com.lab.BackEnd.model.Admin;
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
public interface AdminRepository extends MongoRepository<Admin, String> {
    
    // Basic finder methods
    Optional<Admin> findByEmail(String email);
    Optional<Admin> findByUserId(String userId);
    Optional<Admin> findByAdminId(String adminId);
    Optional<Admin> findByEmployeeId(String employeeId);
    
    // Existence checks
    boolean existsByEmail(String email);
    boolean existsByEmployeeId(String employeeId);
    boolean existsByAdminId(String adminId);
    
    // Admin level and status queries
    List<Admin> findByAdminLevel(String adminLevel);
    List<Admin> findByDepartment(String department);
    List<Admin> findByIsActive(Boolean isActive);
    List<Admin> findByIsSuperAdmin(Boolean isSuperAdmin);
    
    // Paginated queries for better performance
    Page<Admin> findByAdminLevel(String adminLevel, Pageable pageable);
    Page<Admin> findByDepartment(String department, Pageable pageable);
    Page<Admin> findByIsActive(Boolean isActive, Pageable pageable);
    
    // Combined status queries
    List<Admin> findByAdminLevelAndIsActive(String adminLevel, Boolean isActive);
    List<Admin> findByDepartmentAndIsActive(String department, Boolean isActive);
    List<Admin> findByAdminLevelAndDepartment(String adminLevel, String department);
    
    // Location-based queries
    List<Admin> findByCountry(String country);
    List<Admin> findByState(String state);
    List<Admin> findByCity(String city);
    List<Admin> findByWorkLocation(String workLocation);
    List<Admin> findByCountryAndState(String country, String state);
    
    // Work schedule queries
    List<Admin> findByWorkShift(String workShift);
    List<Admin> findByIsAvailable(Boolean isAvailable);
    List<Admin> findByAvailabilityStatus(String availabilityStatus);
    
    // Hierarchy and supervision queries
    List<Admin> findBySupervisorId(String supervisorId);
    List<Admin> findByReportingManager(String reportingManager);
    
    @Query("{'subordinateIds': {$in: [?0]}}")
    List<Admin> findBySupervisesAdmin(String adminId);
    
    // Date-based queries
    List<Admin> findByRegistrationDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    List<Admin> findByRegistrationDateAfter(LocalDateTime date);
    List<Admin> findByLastLoginBefore(LocalDateTime date);
    List<Admin> findByLastLoginAfter(LocalDateTime date);
    List<Admin> findByJoiningDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    // Performance and activity queries
    @Query("{'performanceScore': {$gte: ?0}}")
    List<Admin> findByPerformanceScoreGreaterThanEqual(Double score);
    
    @Query("{'totalNGOsVerified': {$gte: ?0}}")
    List<Admin> findByTotalNGOsVerifiedGreaterThanEqual(Integer count);
    
    @Query("{'totalTicketsResolved': {$gte: ?0}}")
    List<Admin> findByTotalTicketsResolvedGreaterThanEqual(Integer count);
    
    @Query("{'customerSatisfactionRating': {$gte: ?0}}")
    List<Admin> findByCustomerSatisfactionRatingGreaterThanEqual(Double rating);
    
    // Search and filtering methods
    @Query("{'fullName': {$regex: ?0, $options: 'i'}}")
    List<Admin> findByFullNameContainingIgnoreCase(String name);
    
    @Query("{'$or': [" +
           "{'fullName': {$regex: ?0, $options: 'i'}}, " +
           "{'email': {$regex: ?0, $options: 'i'}}, " +
           "{'employeeId': {$regex: ?0, $options: 'i'}}, " +
           "{'designation': {$regex: ?0, $options: 'i'}}" +
           "]}")
    List<Admin> searchAdmins(String searchTerm);
    
    // Paginated search
    @Query("{'$or': [" +
           "{'fullName': {$regex: ?0, $options: 'i'}}, " +
           "{'email': {$regex: ?0, $options: 'i'}}, " +
           "{'employeeId': {$regex: ?0, $options: 'i'}}" +
           "]}")
    Page<Admin> searchAdmins(String searchTerm, Pageable pageable);
    
    // Permission and access queries
    @Query("{'permissions': {$in: [?0]}}")
    List<Admin> findByPermission(String permission);
    
    @Query("{'accessibleModules': {$in: [?0]}}")
    List<Admin> findByAccessibleModule(String module);
    
    @Query("{'permissions': {$all: ?0}}")
    List<Admin> findByAllPermissions(List<String> permissions);
    
    // Security and audit queries
    @Query("{'failedLoginAttempts': {$gte: ?0}}")
    List<Admin> findByFailedLoginAttemptsGreaterThanEqual(Integer attempts);
    
    @Query("{'accountLockedUntil': {$gt: ?0}}")
    List<Admin> findLockedAccounts(LocalDateTime currentTime);
    
    @Query("{'twoFactorEnabled': ?0}")
    List<Admin> findByTwoFactorEnabled(Boolean enabled);
    
    @Query("{'forcePasswordChange': true}")
    List<Admin> findAdminsRequiringPasswordChange();
    
    @Query("{'lastPasswordChange': {$lt: ?0}}")
    List<Admin> findAdminsWithOldPasswords(LocalDateTime cutoffDate);
    
    // Training and certification queries
    @Query("{'certifications': {$in: [?0]}}")
    List<Admin> findByCertification(String certification);
    
    @Query("{'trainingCompleted': {$in: [?0]}}")
    List<Admin> findByCompletedTraining(String training);
    
    @Query("{'trainingStatus': ?0}")
    List<Admin> findByTrainingStatus(String status);
    
    @Query("{'lastTrainingDate': {$lt: ?0}}")
    List<Admin> findAdminsNeedingTraining(LocalDateTime cutoffDate);
    
    // Activity and engagement queries
    @Query("{'lastActivityDate': {$lt: ?0}}")
    List<Admin> findInactiveAdmins(LocalDateTime cutoffDate);
    
    @Query("{'lastLogin': {$gte: ?0}}")
    List<Admin> findRecentlyActiveAdmins(LocalDateTime since);
    
    @Query("{'totalSystemAccess': {$gte: ?0}}")
    List<Admin> findBySystemAccessGreaterThanEqual(Integer accessCount);
    
    // Top performers queries
    @Query(value = "{'isActive': true}", sort = "{'performanceScore': -1}")
    List<Admin> findTopPerformers(Pageable pageable);
    
    @Query(value = "{'isActive': true}", sort = "{'totalNGOsVerified': -1}")
    List<Admin> findTopNGOVerifiers(Pageable pageable);
    
    @Query(value = "{'isActive': true}", sort = "{'totalTicketsResolved': -1}")
    List<Admin> findTopSupportAgents(Pageable pageable);
    
    @Query(value = "{'isActive': true}", sort = "{'customerSatisfactionRating': -1}")
    List<Admin> findHighestRatedAdmins(Pageable pageable);
    
    // Recent activities
    @Query(value = "{}", sort = "{'registrationDate': -1}")
    List<Admin> findRecentRegistrations(Pageable pageable);
    
    @Query(value = "{}", sort = "{'lastLogin': -1}")
    List<Admin> findRecentlyLoggedIn(Pageable pageable);
    
    // Dashboard statistics queries
    @Query(value = "{'isActive': true}", count = true)
    long countActiveAdmins();
    
    @Query(value = "{'isSuperAdmin': true}", count = true)
    long countSuperAdmins();
    
    @Query(value = "{'adminLevel': ?0}", count = true)
    long countByAdminLevel(String adminLevel);
    
    @Query(value = "{'department': ?0}", count = true)
    long countByDepartment(String department);
    
    @Query(value = "{'isActive': true, 'lastLogin': {$gte: ?0}}", count = true)
    long countActiveAdminsSince(LocalDateTime since);
    
    @Query(value = "{'accountLockedUntil': {$gt: ?0}}", count = true)
    long countLockedAccounts(LocalDateTime currentTime);
    
    // Complex queries for admin management
    @Query("{'adminLevel': ?0, 'department': ?1, 'isActive': true}")
    List<Admin> findActiveAdminsByLevelAndDepartment(String adminLevel, String department);
    
    @Query("{'workLocation': ?0, 'workShift': ?1, 'isActive': true}")
    List<Admin> findActiveAdminsByLocationAndShift(String workLocation, String workShift);
    
    @Query("{'country': ?0, 'state': ?1, 'isActive': true}")
    List<Admin> findActiveAdminsByLocation(String country, String state);
    
    @Query("{'registrationDate': {$gte: ?0, $lte: ?1}}")
    List<Admin> findAdminsRegisteredInDateRange(LocalDateTime startDate, LocalDateTime endDate);
    
    // Notification preferences queries
    @Query("{'emailNotifications': ?0}")
    List<Admin> findByEmailNotifications(Boolean enabled);
    
    @Query("{'systemAlerts': ?0}")
    List<Admin> findBySystemAlerts(Boolean enabled);
    
    @Query("{'reportNotifications': ?0}")
    List<Admin> findByReportNotifications(Boolean enabled);
    
    // Theme and preference queries
    List<Admin> findByPreferredLanguage(String language);
    List<Admin> findByTimezone(String timezone);
    List<Admin> findByTheme(String theme);
    
    // Advanced aggregation queries for analytics
    @Aggregation(pipeline = {
        "{ $match: { 'isActive': true } }",
        "{ $group: { _id: '$department', count: { $sum: 1 }, avgPerformance: { $avg: '$performanceScore' } } }",
        "{ $sort: { count: -1 } }"
    })
    List<Object> getAdminStatsByDepartment();
    
    @Aggregation(pipeline = {
        "{ $match: { 'isActive': true } }",
        "{ $group: { _id: '$adminLevel', count: { $sum: 1 }, totalNGOsVerified: { $sum: '$totalNGOsVerified' } } }",
        "{ $sort: { count: -1 } }"
    })
    List<Object> getAdminStatsByLevel();
    
    @Aggregation(pipeline = {
        "{ $match: { 'isActive': true } }",
        "{ $group: { _id: '$workLocation', count: { $sum: 1 }, avgSatisfaction: { $avg: '$customerSatisfactionRating' } } }",
        "{ $sort: { count: -1 } }"
    })
    List<Object> getAdminStatsByWorkLocation();
    
    @Aggregation(pipeline = {
        "{ $match: { 'lastLogin': { $gte: ?0 } } }",
        "{ $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$lastLogin' } }, count: { $sum: 1 } } }",
        "{ $sort: { '_id': -1 } }"
    })
    List<Object> getDailyLoginStats(LocalDateTime since);
    
    // Performance analytics
    @Aggregation(pipeline = {
        "{ $match: { 'isActive': true, 'performanceScore': { $gt: 0 } } }",
        "{ $group: { _id: null, avgPerformance: { $avg: '$performanceScore' }, maxPerformance: { $max: '$performanceScore' }, minPerformance: { $min: '$performanceScore' } } }"
    })
    List<Object> getPerformanceStatistics();
    
    // Workload distribution
    @Aggregation(pipeline = {
        "{ $match: { 'isActive': true } }",
        "{ $group: { _id: '$department', totalNGOsVerified: { $sum: '$totalNGOsVerified' }, totalTicketsResolved: { $sum: '$totalTicketsResolved' }, adminCount: { $sum: 1 } } }",
        "{ $addFields: { avgNGOsPerAdmin: { $divide: ['$totalNGOsVerified', '$adminCount'] }, avgTicketsPerAdmin: { $divide: ['$totalTicketsResolved', '$adminCount'] } } }",
        "{ $sort: { totalNGOsVerified: -1 } }"
    })
    List<Object> getWorkloadDistributionByDepartment();
    
    // Custom update queries (if needed)
    @Query("{'email': ?0}")
    Optional<Admin> findByEmailForUpdate(String email);
    
    @Query("{'adminId': ?0}")
    Optional<Admin> findByAdminIdForUpdate(String adminId);
    
    // Bulk operations support
    @Query("{'adminLevel': ?0, 'isActive': true}")
    List<Admin> findActiveAdminsByLevel(String adminLevel);
    
    @Query("{'department': ?0, 'isActive': true}")
    List<Admin> findActiveAdminsByDepartment(String department);
}
