package com.lab.BackEnd.repository;

import com.lab.BackEnd.model.Event;
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
public interface EventRepository extends MongoRepository<Event, String> {
    
    // Basic finder methods
    Optional<Event> findByEventId(String eventId);
    List<Event> findByOrganizerId(String organizerId);
    List<Event> findByOrganizerIdAndStatus(String organizerId, String status);
    
    // Status-based queries
    List<Event> findByStatus(String status);
    List<Event> findByApprovalStatus(String approvalStatus);
    List<Event> findByStatusAndApprovalStatus(String status, String approvalStatus);
    
    // Paginated status queries
    Page<Event> findByStatus(String status, Pageable pageable);
    Page<Event> findByApprovalStatus(String approvalStatus, Pageable pageable);
    Page<Event> findByStatusAndApprovalStatus(String status, String approvalStatus, Pageable pageable);
    
    // Event type queries
    List<Event> findByEventType(String eventType);
    List<Event> findByEventTypeAndStatus(String eventType, String status);
    Page<Event> findByEventType(String eventType, Pageable pageable);
    
    // Date-based queries
    List<Event> findByEventDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    List<Event> findByEventDateAfter(LocalDateTime date);
    List<Event> findByEventDateBefore(LocalDateTime date);
    
    // Upcoming events
    @Query("{'eventDate': {$gte: ?0}, 'status': 'ACTIVE', 'approvalStatus': 'APPROVED'}")
    List<Event> findUpcomingEvents(LocalDateTime currentDate);
    
    @Query("{'eventDate': {$gte: ?0}, 'status': 'ACTIVE', 'approvalStatus': 'APPROVED'}")
    Page<Event> findUpcomingEvents(LocalDateTime currentDate, Pageable pageable);
    
    // Past events
    @Query("{'eventDate': {$lt: ?0}, 'status': {$in: ['COMPLETED', 'ACTIVE']}}")
    List<Event> findPastEvents(LocalDateTime currentDate);
    
    @Query("{'eventDate': {$lt: ?0}, 'status': {$in: ['COMPLETED', 'ACTIVE']}}")
    Page<Event> findPastEvents(LocalDateTime currentDate, Pageable pageable);
    
    // Location-based queries
    @Query("{'location.city': {$regex: ?0, $options: 'i'}}")
    List<Event> findByLocationCity(String city);
    
    @Query("{'location.state': {$regex: ?0, $options: 'i'}}")
    List<Event> findByLocationState(String state);
    
    @Query("{'location.country': {$regex: ?0, $options: 'i'}}")
    List<Event> findByLocationCountry(String country);
    
    @Query("{'location.city': {$regex: ?0, $options: 'i'}, 'eventDate': {$gte: ?1}}")
    List<Event> findUpcomingEventsByCity(String city, LocalDateTime currentDate);
    
    // Virtual events
    @Query("{'isVirtualEvent': true}")
    List<Event> findVirtualEvents();
    
    @Query("{'isVirtualEvent': true, 'eventDate': {$gte: ?0}}")
    List<Event> findUpcomingVirtualEvents(LocalDateTime currentDate);
    
    // Category-based queries
    @Query("{'categories': {$in: [?0]}}")
    List<Event> findByCategory(String category);
    
    @Query("{'categories': {$in: ?0}}")
    List<Event> findByCategoriesIn(List<String> categories);
    
    @Query("{'categories': {$in: ?0}, 'eventDate': {$gte: ?1}, 'status': 'ACTIVE'}")
    List<Event> findUpcomingEventsByCategories(List<String> categories, LocalDateTime currentDate);
    
    // Search functionality
    @Query("{'$or': [" +
           "{'title': {$regex: ?0, $options: 'i'}}, " +
           "{'description': {$regex: ?0, $options: 'i'}}, " +
           "{'organizerName': {$regex: ?0, $options: 'i'}}, " +
           "{'categories': {$elemMatch: {$regex: ?0, $options: 'i'}}}" +
           "]}")
    List<Event> searchEvents(String searchTerm);
    
    @Query("{'$or': [" +
           "{'title': {$regex: ?0, $options: 'i'}}, " +
           "{'description': {$regex: ?0, $options: 'i'}}, " +
           "{'organizerName': {$regex: ?0, $options: 'i'}}" +
           "]}")
    Page<Event> searchEvents(String searchTerm, Pageable pageable);
    
    // Public events for donors
    @Query("{'isPublic': true, 'status': 'ACTIVE', 'approvalStatus': 'APPROVED'}")
    List<Event> findPublicEvents();
    
    @Query("{'isPublic': true, 'status': 'ACTIVE', 'approvalStatus': 'APPROVED'}")
    Page<Event> findPublicEvents(Pageable pageable);
    
    @Query("{'isPublic': true, 'status': 'ACTIVE', 'approvalStatus': 'APPROVED', 'eventDate': {$gte: ?0}}")
    List<Event> findUpcomingPublicEvents(LocalDateTime currentDate);
    
    @Query("{'isPublic': true, 'status': 'ACTIVE', 'approvalStatus': 'APPROVED', 'eventDate': {$gte: ?0}}")
    Page<Event> findUpcomingPublicEvents(LocalDateTime currentDate, Pageable pageable);
    
    // Events accepting donations
    @Query("{'allowDonations': true, 'status': 'ACTIVE', 'approvalStatus': 'APPROVED'}")
    List<Event> findEventsAcceptingDonations();
    
    @Query("{'allowDonations': true, 'status': 'ACTIVE', 'approvalStatus': 'APPROVED', 'eventDate': {$gte: ?0}}")
    List<Event> findUpcomingEventsAcceptingDonations(LocalDateTime currentDate);
    
    // Events needing volunteers
    @Query("{'allowVolunteers': true, 'status': 'ACTIVE', 'approvalStatus': 'APPROVED'}")
    List<Event> findEventsNeedingVolunteers();
    
    @Query("{'allowVolunteers': true, 'status': 'ACTIVE', 'approvalStatus': 'APPROVED', 'eventDate': {$gte: ?0}}")
    List<Event> findUpcomingEventsNeedingVolunteers(LocalDateTime currentDate);
    
    @Query("{'allowVolunteers': true, 'status': 'ACTIVE', 'approvalStatus': 'APPROVED', " +
           "'$expr': {$lt: ['$registeredVolunteers', '$targetVolunteers']}}")
    List<Event> findEventsNeedingMoreVolunteers();
    
    // Registration-based queries
    @Query("{'requiresRegistration': true, 'registrationDeadline': {$gte: ?0}}")
    List<Event> findEventsWithOpenRegistration(LocalDateTime currentDate);
    
    @Query("{'registeredParticipants': {$in: [?0]}}")
    List<Event> findEventsByParticipant(String userId);
    
    @Query("{'volunteers': {$in: [?0]}}")
    List<Event> findEventsByVolunteer(String userId);
    
    // Capacity-based queries
    @Query("{'maxParticipants': {$gt: 0}, '$expr': {$lt: ['$currentParticipants', '$maxParticipants']}}")
    List<Event> findEventsWithAvailableSpots();
    
    @Query("{'maxParticipants': {$gt: 0}, '$expr': {$gte: ['$currentParticipants', '$maxParticipants']}}")
    List<Event> findFullyBookedEvents();
    
    // Fundraising queries
    @Query("{'targetAmount': {$gt: 0}}")
    List<Event> findFundraisingEvents();
    
    @Query("{'targetAmount': {$gt: 0}, '$expr': {$lt: ['$raisedAmount', '$targetAmount']}}")
    List<Event> findEventsNeedingFunding();
    
    @Query("{'targetAmount': {$gt: 0}, '$expr': {$gte: ['$raisedAmount', '$targetAmount']}}")
    List<Event> findFullyFundedEvents();
    
    // Admin approval queries
    @Query("{'approvalStatus': 'PENDING'}")
    List<Event> findPendingApprovalEvents();
    
    @Query("{'approvalStatus': 'PENDING'}")
    Page<Event> findPendingApprovalEvents(Pageable pageable);
    
    @Query("{'approvalStatus': 'UNDER_REVIEW'}")
    List<Event> findEventsUnderReview();
    
    @Query("{'approvedBy': ?0}")
    List<Event> findEventsApprovedBy(String adminId);
    
    // Organizer-specific queries
    @Query("{'organizerId': ?0, 'status': {$in: ['ACTIVE', 'COMPLETED']}}")
    List<Event> findActiveEventsByOrganizer(String organizerId);
    
    @Query("{'organizerId': ?0, 'eventDate': {$gte: ?1}}")
    List<Event> findUpcomingEventsByOrganizer(String organizerId, LocalDateTime currentDate);
    
    @Query("{'organizerId': ?0, 'status': 'COMPLETED'}")
    List<Event> findCompletedEventsByOrganizer(String organizerId);
    
    // Recent events
    @Query(value = "{}", sort = "{'createdDate': -1}")
    List<Event> findRecentEvents(Pageable pageable);
    
    @Query(value = "{'status': 'ACTIVE', 'approvalStatus': 'APPROVED'}", sort = "{'createdDate': -1}")
    List<Event> findRecentActiveEvents(Pageable pageable);
    
    // Popular events (by view count)
    @Query(value = "{'status': 'ACTIVE', 'approvalStatus': 'APPROVED'}", sort = "{'viewCount': -1}")
    List<Event> findPopularEvents(Pageable pageable);
    
    @Query(value = "{'status': 'ACTIVE', 'approvalStatus': 'APPROVED'}", sort = "{'interestedCount': -1}")
    List<Event> findMostInterestedEvents(Pageable pageable);
    
    // Featured events (high engagement)
    @Query(value = "{'status': 'ACTIVE', 'approvalStatus': 'APPROVED', 'viewCount': {$gte: ?0}}", 
           sort = "{'viewCount': -1, 'interestedCount': -1}")
    List<Event> findFeaturedEvents(Integer minViews, Pageable pageable);
    
    // Recurring events
    @Query("{'isRecurring': true}")
    List<Event> findRecurringEvents();
    
    @Query("{'isRecurring': true, 'recurringPattern': ?0}")
    List<Event> findRecurringEventsByPattern(String pattern);
    
    // Events by date range and filters
    @Query("{'eventDate': {$gte: ?0, $lte: ?1}, 'status': 'ACTIVE', 'approvalStatus': 'APPROVED'}")
    List<Event> findActiveEventsInDateRange(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("{'eventDate': {$gte: ?0, $lte: ?1}, 'categories': {$in: ?2}, 'status': 'ACTIVE'}")
    List<Event> findEventsInDateRangeByCategories(LocalDateTime startDate, LocalDateTime endDate, List<String> categories);
    
    // Count queries for statistics
    @Query(value = "{'status': 'ACTIVE'}", count = true)
    long countActiveEvents();
    
    @Query(value = "{'approvalStatus': 'PENDING'}", count = true)
    long countPendingApprovalEvents();
    
    @Query(value = "{'organizerId': ?0}", count = true)
    long countEventsByOrganizer(String organizerId);
    
    @Query(value = "{'eventDate': {$gte: ?0}}", count = true)
    long countUpcomingEvents(LocalDateTime currentDate);
    
    @Query(value = "{'eventType': ?0}", count = true)
    long countEventsByType(String eventType);
    
    // Advanced aggregation queries
    @Aggregation(pipeline = {
        "{ $match: { 'status': 'ACTIVE', 'approvalStatus': 'APPROVED' } }",
        "{ $group: { _id: '$eventType', count: { $sum: 1 }, totalTarget: { $sum: '$targetAmount' }, totalRaised: { $sum: '$raisedAmount' } } }",
        "{ $sort: { count: -1 } }"
    })
    List<Object> getEventStatsByType();
    
    @Aggregation(pipeline = {
        "{ $match: { 'status': 'ACTIVE' } }",
        "{ $unwind: '$categories' }",
        "{ $group: { _id: '$categories', count: { $sum: 1 }, avgTarget: { $avg: '$targetAmount' } } }",
        "{ $sort: { count: -1 } }"
    })
    List<Object> getEventStatsByCategory();
    
    @Aggregation(pipeline = {
        "{ $match: { 'eventDate': { $gte: ?0 } } }",
        "{ $group: { _id: { $dateToString: { format: '%Y-%m', date: '$eventDate' } }, count: { $sum: 1 } } }",
        "{ $sort: { '_id': 1 } }"
    })
    List<Object> getMonthlyEventStats(LocalDateTime fromDate);
    
    @Aggregation(pipeline = {
        "{ $match: { 'location.city': { $exists: true, $ne: null } } }",
        "{ $group: { _id: '$location.city', count: { $sum: 1 }, totalParticipants: { $sum: '$currentParticipants' } } }",
        "{ $sort: { count: -1 } }"
    })
    List<Object> getEventStatsByCity();
    
    // Performance analytics
    @Aggregation(pipeline = {
        "{ $match: { 'targetAmount': { $gt: 0 } } }",
        "{ $addFields: { fundingProgress: { $divide: ['$raisedAmount', '$targetAmount'] } } }",
        "{ $match: { fundingProgress: { $gte: ?0 } } }",
        "{ $sort: { fundingProgress: -1 } }"
    })
    List<Event> findEventsByFundingProgress(Double minProgress);
    
    @Aggregation(pipeline = {
        "{ $match: { 'maxParticipants': { $gt: 0 } } }",
        "{ $addFields: { occupancyRate: { $divide: ['$currentParticipants', '$maxParticipants'] } } }",
        "{ $match: { occupancyRate: { $gte: ?0 } } }",
        "{ $sort: { occupancyRate: -1 } }"
    })
    List<Event> findEventsByOccupancyRate(Double minRate);
    
    // Complex filtering for different user roles
    @Query("{'isPublic': true, 'status': 'ACTIVE', 'approvalStatus': 'APPROVED', " +
           "'eventDate': {$gte: ?0}, 'categories': {$in: ?1}}")
    Page<Event> findPublicEventsForDonors(LocalDateTime currentDate, List<String> interestedCategories, Pageable pageable);
    
    @Query("{'organizerId': ?0, 'status': {$in: ?1}}")
    Page<Event> findEventsByOrganizerAndStatuses(String organizerId, List<String> statuses, Pageable pageable);
    
    @Query("{'approvalStatus': {$in: ?0}, 'createdDate': {$gte: ?1}}")
    Page<Event> findEventsForAdminReview(List<String> approvalStatuses, LocalDateTime fromDate, Pageable pageable);
    
    // Bulk operations support
    @Query("{'eventId': {$in: ?0}}")
    List<Event> findEventsByIds(List<String> eventIds);
    
    @Query("{'organizerId': {$in: ?0}, 'status': 'ACTIVE'}")
    List<Event> findActiveEventsByOrganizers(List<String> organizerIds);
}
