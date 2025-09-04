package com.lab.BackEnd.controller;

import com.lab.BackEnd.dto.request.EventRequest;
import com.lab.BackEnd.dto.response.ApiResponse;
import com.lab.BackEnd.model.Event;
import com.lab.BackEnd.repository.EventRepository;
import com.lab.BackEnd.service.EventService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class EventController {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private EventService eventService;

    // ==================== PUBLIC EVENT ENDPOINTS ====================

    // Get all public events (for donors and general public)
    @GetMapping("/public")
    public ResponseEntity<ApiResponse<Page<Event>>> getPublicEvents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "eventDate") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String eventType) {
        
        try {
            Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                       Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
            Pageable pageable = PageRequest.of(page, size, sort);
            
            Page<Event> events = eventService.getPublicEvents(category, city, eventType, pageable);
            return ResponseEntity.ok(ApiResponse.success("Public events retrieved successfully", events));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve public events: " + e.getMessage()));
        }
    }

    // Get upcoming public events
    @GetMapping("/public/upcoming")
    public ResponseEntity<ApiResponse<Page<Event>>> getUpcomingPublicEvents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) List<String> categories) {
        
        try {
            Pageable pageable = PageRequest.of(page, size, Sort.by("eventDate").ascending());
            Page<Event> events = eventRepository.findUpcomingPublicEvents(LocalDateTime.now(), pageable);
            return ResponseEntity.ok(ApiResponse.success("Upcoming events retrieved successfully", events));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve upcoming events: " + e.getMessage()));
        }
    }

    // Search public events
    @GetMapping("/public/search")
    public ResponseEntity<ApiResponse<Page<Event>>> searchPublicEvents(
            @RequestParam String searchTerm,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        
        try {
            Pageable pageable = PageRequest.of(page, size, Sort.by("eventDate").ascending());
            Page<Event> events = eventRepository.searchEvents(searchTerm, pageable);
            return ResponseEntity.ok(ApiResponse.success("Search results retrieved successfully", events));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to search events: " + e.getMessage()));
        }
    }

    // Get event details by ID (public access)
    @GetMapping("/{eventId}")
    public ResponseEntity<ApiResponse<Event>> getEventById(@PathVariable String eventId) {
        try {
            Optional<Event> eventOptional = eventRepository.findByEventId(eventId);
            if (eventOptional.isPresent()) {
                Event event = eventOptional.get();
                // Increment view count
                event.incrementViewCount();
                eventRepository.save(event);
                
                return ResponseEntity.ok(ApiResponse.success("Event retrieved successfully", event));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve event: " + e.getMessage()));
        }
    }

    // Get events accepting donations
    @GetMapping("/donations")
    public ResponseEntity<ApiResponse<List<Event>>> getEventsAcceptingDonations() {
        try {
            List<Event> events = eventRepository.findUpcomingEventsAcceptingDonations(LocalDateTime.now());
            return ResponseEntity.ok(ApiResponse.success("Donation events retrieved successfully", events));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve donation events: " + e.getMessage()));
        }
    }

    // Get events needing volunteers
    @GetMapping("/volunteers")
    public ResponseEntity<ApiResponse<List<Event>>> getEventsNeedingVolunteers() {
        try {
            List<Event> events = eventRepository.findUpcomingEventsNeedingVolunteers(LocalDateTime.now());
            return ResponseEntity.ok(ApiResponse.success("Volunteer events retrieved successfully", events));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve volunteer events: " + e.getMessage()));
        }
    }

    // ==================== NGO EVENT MANAGEMENT ====================

    // Get events by organizer (NGO)
    @GetMapping("/my-events")
    public ResponseEntity<ApiResponse<Page<Event>>> getMyEvents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) String status) {
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        
        try {
            Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                       Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
            Pageable pageable = PageRequest.of(page, size, sort);
            
            Page<Event> events = eventService.getEventsByOrganizer(userEmail, status, pageable);
            return ResponseEntity.ok(ApiResponse.success("Your events retrieved successfully", events));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve your events: " + e.getMessage()));
        }
    }

    // Create a new event (NGO only)
    @PostMapping("/create")
    public ResponseEntity<ApiResponse<Event>> createEvent(@Valid @RequestBody EventRequest eventRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        
        try {
            Event createdEvent = eventService.createEvent(eventRequest, userEmail);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Event created successfully", createdEvent));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to create event: " + e.getMessage()));
        }
    }

    // Update an event (NGO only)
    @PutMapping("/{eventId}")
    public ResponseEntity<ApiResponse<Event>> updateEvent(
            @PathVariable String eventId,
            @Valid @RequestBody EventRequest eventRequest) {
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        
        try {
            Event updatedEvent = eventService.updateEvent(eventId, eventRequest, userEmail);
            return ResponseEntity.ok(ApiResponse.success("Event updated successfully", updatedEvent));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to update event: " + e.getMessage()));
        }
    }

    // Delete an event (NGO only)
    @DeleteMapping("/{eventId}")
    public ResponseEntity<ApiResponse<String>> deleteEvent(@PathVariable String eventId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        
        try {
            eventService.deleteEvent(eventId, userEmail);
            return ResponseEntity.ok(ApiResponse.success("Event deleted successfully", eventId));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to delete event: " + e.getMessage()));
        }
    }

    // Upload event banner image
    @PostMapping("/{eventId}/upload-banner")
    public ResponseEntity<ApiResponse<String>> uploadEventBanner(
            @PathVariable String eventId,
            @RequestParam("banner") MultipartFile bannerFile) {
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        
        try {
            String bannerUrl = eventService.uploadEventBanner(eventId, bannerFile, userEmail);
            return ResponseEntity.ok(ApiResponse.success("Event banner uploaded successfully", bannerUrl));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to upload banner: " + e.getMessage()));
        }
    }

    // ==================== PARTICIPANT MANAGEMENT ====================

    // Register for an event
    @PostMapping("/{eventId}/register")
    public ResponseEntity<ApiResponse<String>> registerForEvent(@PathVariable String eventId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        
        try {
            eventService.registerForEvent(eventId, userEmail);
            return ResponseEntity.ok(ApiResponse.success("Successfully registered for event", eventId));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to register for event: " + e.getMessage()));
        }
    }

    // Unregister from an event
    @DeleteMapping("/{eventId}/register")
    public ResponseEntity<ApiResponse<String>> unregisterFromEvent(@PathVariable String eventId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        
        try {
            eventService.unregisterFromEvent(eventId, userEmail);
            return ResponseEntity.ok(ApiResponse.success("Successfully unregistered from event", eventId));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to unregister from event: " + e.getMessage()));
        }
    }

    // Volunteer for an event
    @PostMapping("/{eventId}/volunteer")
    public ResponseEntity<ApiResponse<String>> volunteerForEvent(@PathVariable String eventId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        
        try {
            eventService.volunteerForEvent(eventId, userEmail);
            return ResponseEntity.ok(ApiResponse.success("Successfully volunteered for event", eventId));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to volunteer for event: " + e.getMessage()));
        }
    }

    // Donate to an event
    @PostMapping("/{eventId}/donate")
    public ResponseEntity<ApiResponse<String>> donateToEvent(
            @PathVariable String eventId,
            @RequestParam Double amount,
            @RequestParam(required = false) String message) {
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        
        try {
            eventService.donateToEvent(eventId, userEmail, amount, message);
            return ResponseEntity.ok(ApiResponse.success("Donation successful", "Amount: " + amount));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to process donation: " + e.getMessage()));
        }
    }

    // Get user's registered events
    @GetMapping("/my-registrations")
    public ResponseEntity<ApiResponse<List<Event>>> getMyRegistrations() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        
        try {
            List<Event> events = eventService.getUserRegisteredEvents(userEmail);
            return ResponseEntity.ok(ApiResponse.success("Your registered events retrieved successfully", events));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve registered events: " + e.getMessage()));
        }
    }

    // Get user's volunteer events
    @GetMapping("/my-volunteer-events")
    public ResponseEntity<ApiResponse<List<Event>>> getMyVolunteerEvents() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        
        try {
            List<Event> events = eventService.getUserVolunteerEvents(userEmail);
            return ResponseEntity.ok(ApiResponse.success("Your volunteer events retrieved successfully", events));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve volunteer events: " + e.getMessage()));
        }
    }

    // ==================== ADMIN EVENT MANAGEMENT ====================

    // Get all events for admin review
    @GetMapping("/admin/all")
    public ResponseEntity<ApiResponse<Page<Event>>> getAllEventsForAdmin(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String approvalStatus) {
        
        try {
            Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                       Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
            Pageable pageable = PageRequest.of(page, size, sort);
            
            Page<Event> events;
            if (status != null && approvalStatus != null) {
                events = eventRepository.findByStatusAndApprovalStatus(status, approvalStatus, pageable);
            } else if (status != null) {
                events = eventRepository.findByStatus(status, pageable);
            } else if (approvalStatus != null) {
                events = eventRepository.findByApprovalStatus(approvalStatus, pageable);
            } else {
                events = eventRepository.findAll(pageable);
            }
            
            return ResponseEntity.ok(ApiResponse.success("All events retrieved successfully", events));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve events: " + e.getMessage()));
        }
    }

    // Get pending approval events
    @GetMapping("/admin/pending")
    public ResponseEntity<ApiResponse<Page<Event>>> getPendingApprovalEvents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        try {
            Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").ascending());
            Page<Event> events = eventRepository.findPendingApprovalEvents(pageable);
            return ResponseEntity.ok(ApiResponse.success("Pending events retrieved successfully", events));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve pending events: " + e.getMessage()));
        }
    }

    // Approve an event (Admin only)
    @PostMapping("/{eventId}/approve")
    public ResponseEntity<ApiResponse<Event>> approveEvent(
            @PathVariable String eventId,
            @RequestParam(required = false) String notes) {
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String adminEmail = authentication.getName();
        
        try {
            Event approvedEvent = eventService.approveEvent(eventId, adminEmail, notes);
            return ResponseEntity.ok(ApiResponse.success("Event approved successfully", approvedEvent));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to approve event: " + e.getMessage()));
        }
    }

    // Reject an event (Admin only)
    @PostMapping("/{eventId}/reject")
    public ResponseEntity<ApiResponse<Event>> rejectEvent(
            @PathVariable String eventId,
            @RequestParam String reason) {
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String adminEmail = authentication.getName();
        
        try {
            Event rejectedEvent = eventService.rejectEvent(eventId, adminEmail, reason);
            return ResponseEntity.ok(ApiResponse.success("Event rejected successfully", rejectedEvent));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to reject event: " + e.getMessage()));
        }
    }

    // Update event status (Admin only)
    @PutMapping("/{eventId}/status")
    public ResponseEntity<ApiResponse<Event>> updateEventStatus(
            @PathVariable String eventId,
            @RequestParam String status) {
        
        try {
            Event updatedEvent = eventService.updateEventStatus(eventId, status);
            return ResponseEntity.ok(ApiResponse.success("Event status updated successfully", updatedEvent));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to update event status: " + e.getMessage()));
        }
    }

    // ==================== ANALYTICS AND STATISTICS ====================

    // Get event statistics
    @GetMapping("/statistics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getEventStatistics() {
        try {
            Map<String, Object> stats = new HashMap<>();
            
            stats.put("totalEvents", eventRepository.count());
            stats.put("activeEvents", eventRepository.countActiveEvents());
            stats.put("pendingApproval", eventRepository.countPendingApprovalEvents());
            stats.put("upcomingEvents", eventRepository.countUpcomingEvents(LocalDateTime.now()));
            
            // Event type statistics
            stats.put("eventsByType", eventRepository.getEventStatsByType());
            stats.put("eventsByCategory", eventRepository.getEventStatsByCategory());
            stats.put("eventsByCity", eventRepository.getEventStatsByCity());
            
            return ResponseEntity.ok(ApiResponse.success("Event statistics retrieved successfully", stats));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve statistics: " + e.getMessage()));
        }
    }

    // Get popular events
    @GetMapping("/popular")
    public ResponseEntity<ApiResponse<List<Event>>> getPopularEvents(
            @RequestParam(defaultValue = "10") int limit) {
        
        try {
            Pageable pageable = PageRequest.of(0, limit);
            List<Event> events = eventRepository.findPopularEvents(pageable);
            return ResponseEntity.ok(ApiResponse.success("Popular events retrieved successfully", events));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve popular events: " + e.getMessage()));
        }
    }

    // Get featured events
    @GetMapping("/featured")
    public ResponseEntity<ApiResponse<List<Event>>> getFeaturedEvents(
            @RequestParam(defaultValue = "100") Integer minViews,
            @RequestParam(defaultValue = "6") int limit) {
        
        try {
            Pageable pageable = PageRequest.of(0, limit);
            List<Event> events = eventRepository.findFeaturedEvents(minViews, pageable);
            return ResponseEntity.ok(ApiResponse.success("Featured events retrieved successfully", events));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve featured events: " + e.getMessage()));
        }
    }

    // ==================== UTILITY ENDPOINTS ====================

    // Get event categories
    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<String>>> getEventCategories() {
        try {
            List<String> categories = List.of(
                "Education", "Healthcare", "Environment", "Poverty Alleviation",
                "Disaster Relief", "Animal Welfare", "Human Rights", "Technology Access",
                "Food Security", "Clean Water", "Women Empowerment", "Child Welfare"
            );
            return ResponseEntity.ok(ApiResponse.success("Event categories retrieved successfully", categories));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve categories: " + e.getMessage()));
        }
    }

    // Get event types
    @GetMapping("/types")
    public ResponseEntity<ApiResponse<List<String>>> getEventTypes() {
        try {
            List<String> types = List.of(
                "FUNDRAISING", "AWARENESS", "VOLUNTEER", "DONATION_DRIVE", 
                "COMMUNITY_SERVICE", "EDUCATIONAL", "WORKSHOP", "SEMINAR"
            );
            return ResponseEntity.ok(ApiResponse.success("Event types retrieved successfully", types));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve event types: " + e.getMessage()));
        }
    }

    // ==================== EXCEPTION HANDLING ====================

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<String>> handleException(Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("An unexpected error occurred: " + e.getMessage()));
    }
}
