package com.lab.BackEnd.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.TextIndexed;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import java.util.HashMap;

@Document(collection = "events")
@CompoundIndex(def = "{'eventType': 1, 'status': 1}")
@CompoundIndex(def = "{'organizerId': 1, 'eventDate': 1}")
@CompoundIndex(def = "{'location.city': 1, 'eventDate': 1}")
@CompoundIndex(def = "{'categories': 1, 'status': 1}")
public class Event {
    @Id
    private String eventId;

    // Basic Event Information
    @TextIndexed(weight = 3)
    private String title;
    
    @TextIndexed(weight = 2)
    private String description;
    
    @Indexed
    private String eventType = "FUNDRAISING"; // FUNDRAISING, AWARENESS, VOLUNTEER, DONATION_DRIVE, COMMUNITY_SERVICE, EDUCATIONAL
    
    @Indexed
    private String status = "DRAFT"; // DRAFT, PENDING_APPROVAL, APPROVED, ACTIVE, COMPLETED, CANCELLED, REJECTED
    
    // Event Organizer Information
    @Indexed
    private String organizerId; // NGO ID who created the event
    
    private String organizerName;
    private String organizerType = "NGO"; // NGO, ADMIN, VOLUNTEER
    private String organizerEmail;
    private String organizerPhone;
    
    // Event Details
    @Indexed
    private LocalDateTime eventDate;
    
    private LocalDateTime eventEndDate;
    private LocalDateTime registrationDeadline;
    
    // Location Information
    private Map<String, String> location = new HashMap<>(); // address, city, state, country, venue, coordinates
    private Boolean isVirtualEvent = false;
    private String virtualEventLink;
    
    // Event Categories and Focus Areas
    @Indexed
    private List<String> categories = new ArrayList<>(); // Education, Healthcare, Environment, etc.
    
    private List<String> targetAudience = new ArrayList<>(); // Students, Professionals, General Public, etc.
    
    // Financial Information
    private Double targetAmount = 0.0;
    private Double raisedAmount = 0.0;
    private Double eventBudget = 0.0;
    private String currency = "BDT";
    
    // Participation Information
    private Integer maxParticipants;
    private Integer currentParticipants = 0;
    private Integer targetVolunteers = 0;
    private Integer registeredVolunteers = 0;
    
    // Event Media
    private String bannerImage;
    private List<String> eventImages = new ArrayList<>();
    private String videoUrl;
    private List<String> documents = new ArrayList<>();
    
    // Registration and Requirements
    private Boolean requiresRegistration = true;
    private Boolean isPublic = true;
    private Double registrationFee = 0.0;
    private List<String> requirements = new ArrayList<>(); // Age limit, Skills needed, etc.
    
    // Event Schedule
    private List<Map<String, Object>> schedule = new ArrayList<>(); // Time slots, activities, speakers
    
    // Contact Information
    private String contactPersonName;
    private String contactPersonPhone;
    private String contactPersonEmail;
    
    // Approval and Moderation
    @Indexed
    private String approvalStatus = "PENDING"; // PENDING, APPROVED, REJECTED, UNDER_REVIEW
    
    private String approvedBy; // Admin ID who approved
    private LocalDateTime approvalDate;
    private String rejectionReason;
    private List<String> moderationNotes = new ArrayList<>();
    
    // Tracking and Analytics
    private Integer viewCount = 0;
    private Integer shareCount = 0;
    private Integer interestedCount = 0;
    private Map<String, Integer> participantsByType = new HashMap<>(); // donors, volunteers, beneficiaries
    
    // Event Outcomes
    private String eventReport;
    private List<String> achievements = new ArrayList<>();
    private Map<String, Object> impactMetrics = new HashMap<>();
    private List<String> testimonials = new ArrayList<>();
    
    // Donations and Contributions
    private List<Map<String, Object>> donations = new ArrayList<>();
    private List<Map<String, Object>> sponsorships = new ArrayList<>();
    private Map<String, Double> donationsByCategory = new HashMap<>();
    
    // Participants and Volunteers
    private List<String> registeredParticipants = new ArrayList<>(); // User IDs
    private List<String> volunteers = new ArrayList<>(); // Volunteer IDs
    private List<String> speakers = new ArrayList<>(); // Speaker information
    
    // Event Settings
    private Boolean allowDonations = true;
    private Boolean allowVolunteers = true;
    private Boolean sendReminders = true;
    private Boolean isRecurring = false;
    private String recurringPattern; // WEEKLY, MONTHLY, YEARLY
    
    // Social Media Integration
    private Map<String, String> socialMediaLinks = new HashMap<>();
    private String hashtags;
    private Boolean shareOnSocialMedia = true;
    
    // Timestamps
    @CreatedDate
    @Indexed
    private LocalDateTime createdDate = LocalDateTime.now();
    
    @LastModifiedDate
    private LocalDateTime lastModifiedDate = LocalDateTime.now();
    
    private LocalDateTime publishedDate;
    private LocalDateTime completedDate;
    
    // Audit Fields
    @JsonIgnore
    private String createdBy; // User ID who created the event
    
    @JsonIgnore
    private String lastModifiedBy;
    
    @JsonIgnore
    private List<String> editHistory = new ArrayList<>();

    // Constructors
    public Event() {
        this.createdDate = LocalDateTime.now();
        this.lastModifiedDate = LocalDateTime.now();
        this.categories = new ArrayList<>();
        this.targetAudience = new ArrayList<>();
        this.eventImages = new ArrayList<>();
        this.documents = new ArrayList<>();
        this.requirements = new ArrayList<>();
        this.schedule = new ArrayList<>();
        this.moderationNotes = new ArrayList<>();
        this.achievements = new ArrayList<>();
        this.testimonials = new ArrayList<>();
        this.donations = new ArrayList<>();
        this.sponsorships = new ArrayList<>();
        this.registeredParticipants = new ArrayList<>();
        this.volunteers = new ArrayList<>();
        this.speakers = new ArrayList<>();
        this.editHistory = new ArrayList<>();
        this.location = new HashMap<>();
        this.impactMetrics = new HashMap<>();
        this.donationsByCategory = new HashMap<>();
        this.participantsByType = new HashMap<>();
        this.socialMediaLinks = new HashMap<>();
    }

    public Event(String title, String description, String organizerId, LocalDateTime eventDate) {
        this();
        this.title = title;
        this.description = description;
        this.organizerId = organizerId;
        this.eventDate = eventDate;
    }

    // Utility Methods
    public boolean isActive() {
        return "ACTIVE".equals(this.status) && "APPROVED".equals(this.approvalStatus);
    }
    
    public boolean isUpcoming() {
        return eventDate != null && eventDate.isAfter(LocalDateTime.now());
    }
    
    public boolean isCompleted() {
        return "COMPLETED".equals(this.status) || 
               (eventEndDate != null && eventEndDate.isBefore(LocalDateTime.now()));
    }
    
    public boolean canRegister() {
        return isActive() && isUpcoming() && 
               (maxParticipants == null || currentParticipants < maxParticipants) &&
               (registrationDeadline == null || registrationDeadline.isAfter(LocalDateTime.now()));
    }
    
    public boolean needsApproval() {
        return "PENDING".equals(this.approvalStatus) || "UNDER_REVIEW".equals(this.approvalStatus);
    }
    
    public double getFundraisingProgress() {
        if (targetAmount == null || targetAmount <= 0) return 0.0;
        return Math.min((raisedAmount / targetAmount) * 100, 100.0);
    }
    
    public int getAvailableSpots() {
        if (maxParticipants == null) return Integer.MAX_VALUE;
        return Math.max(0, maxParticipants - currentParticipants);
    }
    
    public boolean isOrganizedBy(String userId) {
        return organizerId != null && organizerId.equals(userId);
    }
    
    public boolean isParticipant(String userId) {
        return registeredParticipants != null && registeredParticipants.contains(userId);
    }
    
    public boolean isVolunteer(String userId) {
        return volunteers != null && volunteers.contains(userId);
    }
    
    public void addParticipant(String userId) {
        if (registeredParticipants == null) {
            registeredParticipants = new ArrayList<>();
        }
        if (!registeredParticipants.contains(userId)) {
            registeredParticipants.add(userId);
            currentParticipants = registeredParticipants.size();
        }
    }
    
    public void removeParticipant(String userId) {
        if (registeredParticipants != null) {
            registeredParticipants.remove(userId);
            currentParticipants = registeredParticipants.size();
        }
    }
    
    public void addVolunteer(String userId) {
        if (volunteers == null) {
            volunteers = new ArrayList<>();
        }
        if (!volunteers.contains(userId)) {
            volunteers.add(userId);
            registeredVolunteers = volunteers.size();
        }
    }
    
    public void addDonation(String donorId, Double amount, String donorName) {
        if (donations == null) {
            donations = new ArrayList<>();
        }
        Map<String, Object> donation = new HashMap<>();
        donation.put("donorId", donorId);
        donation.put("donorName", donorName);
        donation.put("amount", amount);
        donation.put("timestamp", LocalDateTime.now());
        donations.add(donation);
        
        raisedAmount = (raisedAmount != null ? raisedAmount : 0.0) + amount;
    }
    
    public void incrementViewCount() {
        this.viewCount = (this.viewCount != null ? this.viewCount : 0) + 1;
    }
    
    public void updateLastModified() {
        this.lastModifiedDate = LocalDateTime.now();
    }

    // Getters and Setters with null safety
    public String getEventId() { return eventId; }
    public void setEventId(String eventId) { this.eventId = eventId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { 
        this.title = title;
        updateLastModified();
    }

    public String getDescription() { return description; }
    public void setDescription(String description) { 
        this.description = description;
        updateLastModified();
    }

    public String getEventType() { return eventType != null ? eventType : "FUNDRAISING"; }
    public void setEventType(String eventType) { 
        this.eventType = eventType != null ? eventType : "FUNDRAISING";
        updateLastModified();
    }

    public String getStatus() { return status != null ? status : "DRAFT"; }
    public void setStatus(String status) { 
        this.status = status != null ? status : "DRAFT";
        updateLastModified();
    }

    public String getOrganizerId() { return organizerId; }
    public void setOrganizerId(String organizerId) { 
        this.organizerId = organizerId;
        updateLastModified();
    }

    public String getOrganizerName() { return organizerName; }
    public void setOrganizerName(String organizerName) { 
        this.organizerName = organizerName;
        updateLastModified();
    }

    public String getOrganizerType() { return organizerType != null ? organizerType : "NGO"; }
    public void setOrganizerType(String organizerType) { 
        this.organizerType = organizerType != null ? organizerType : "NGO";
        updateLastModified();
    }

    public String getOrganizerEmail() { return organizerEmail; }
    public void setOrganizerEmail(String organizerEmail) { 
        this.organizerEmail = organizerEmail;
        updateLastModified();
    }

    public String getOrganizerPhone() { return organizerPhone; }
    public void setOrganizerPhone(String organizerPhone) { 
        this.organizerPhone = organizerPhone;
        updateLastModified();
    }

    public LocalDateTime getEventDate() { return eventDate; }
    public void setEventDate(LocalDateTime eventDate) { 
        this.eventDate = eventDate;
        updateLastModified();
    }

    public LocalDateTime getEventEndDate() { return eventEndDate; }
    public void setEventEndDate(LocalDateTime eventEndDate) { 
        this.eventEndDate = eventEndDate;
        updateLastModified();
    }

    public LocalDateTime getRegistrationDeadline() { return registrationDeadline; }
    public void setRegistrationDeadline(LocalDateTime registrationDeadline) { 
        this.registrationDeadline = registrationDeadline;
        updateLastModified();
    }

    public Map<String, String> getLocation() { 
        return location != null ? location : new HashMap<>(); 
    }
    public void setLocation(Map<String, String> location) { 
        this.location = location != null ? location : new HashMap<>();
        updateLastModified();
    }

    public Boolean getIsVirtualEvent() { return isVirtualEvent; }
    public void setIsVirtualEvent(Boolean isVirtualEvent) { 
        this.isVirtualEvent = isVirtualEvent != null ? isVirtualEvent : false;
        updateLastModified();
    }
    
    public boolean isVirtualEvent() { return Boolean.TRUE.equals(isVirtualEvent); }

    public String getVirtualEventLink() { return virtualEventLink; }
    public void setVirtualEventLink(String virtualEventLink) { 
        this.virtualEventLink = virtualEventLink;
        updateLastModified();
    }

    public List<String> getCategories() { 
        return categories != null ? categories : new ArrayList<>(); 
    }
    public void setCategories(List<String> categories) { 
        this.categories = categories != null ? categories : new ArrayList<>();
        updateLastModified();
    }

    public List<String> getTargetAudience() { 
        return targetAudience != null ? targetAudience : new ArrayList<>(); 
    }
    public void setTargetAudience(List<String> targetAudience) { 
        this.targetAudience = targetAudience != null ? targetAudience : new ArrayList<>();
        updateLastModified();
    }

    public Double getTargetAmount() { return targetAmount != null ? targetAmount : 0.0; }
    public void setTargetAmount(Double targetAmount) { 
        this.targetAmount = targetAmount != null ? targetAmount : 0.0;
        updateLastModified();
    }

    public Double getRaisedAmount() { return raisedAmount != null ? raisedAmount : 0.0; }
    public void setRaisedAmount(Double raisedAmount) { 
        this.raisedAmount = raisedAmount != null ? raisedAmount : 0.0;
        updateLastModified();
    }

    public Double getEventBudget() { return eventBudget != null ? eventBudget : 0.0; }
    public void setEventBudget(Double eventBudget) { 
        this.eventBudget = eventBudget != null ? eventBudget : 0.0;
        updateLastModified();
    }

    public String getCurrency() { return currency != null ? currency : "BDT"; }
    public void setCurrency(String currency) { 
        this.currency = currency != null ? currency : "BDT";
        updateLastModified();
    }

    public Integer getMaxParticipants() { return maxParticipants; }
    public void setMaxParticipants(Integer maxParticipants) { 
        this.maxParticipants = maxParticipants;
        updateLastModified();
    }

    public Integer getCurrentParticipants() { return currentParticipants != null ? currentParticipants : 0; }
    public void setCurrentParticipants(Integer currentParticipants) { 
        this.currentParticipants = currentParticipants != null ? currentParticipants : 0;
        updateLastModified();
    }

    public Integer getTargetVolunteers() { return targetVolunteers != null ? targetVolunteers : 0; }
    public void setTargetVolunteers(Integer targetVolunteers) { 
        this.targetVolunteers = targetVolunteers != null ? targetVolunteers : 0;
        updateLastModified();
    }

    public Integer getRegisteredVolunteers() { return registeredVolunteers != null ? registeredVolunteers : 0; }
    public void setRegisteredVolunteers(Integer registeredVolunteers) { 
        this.registeredVolunteers = registeredVolunteers != null ? registeredVolunteers : 0;
        updateLastModified();
    }

    public String getBannerImage() { return bannerImage; }
    public void setBannerImage(String bannerImage) { 
        this.bannerImage = bannerImage;
        updateLastModified();
    }

    public List<String> getEventImages() { 
        return eventImages != null ? eventImages : new ArrayList<>(); 
    }
    public void setEventImages(List<String> eventImages) { 
        this.eventImages = eventImages != null ? eventImages : new ArrayList<>();
        updateLastModified();
    }

    public String getVideoUrl() { return videoUrl; }
    public void setVideoUrl(String videoUrl) { 
        this.videoUrl = videoUrl;
        updateLastModified();
    }

    public List<String> getDocuments() { 
        return documents != null ? documents : new ArrayList<>(); 
    }
    public void setDocuments(List<String> documents) { 
        this.documents = documents != null ? documents : new ArrayList<>();
        updateLastModified();
    }

    public Boolean getRequiresRegistration() { return requiresRegistration; }
    public void setRequiresRegistration(Boolean requiresRegistration) { 
        this.requiresRegistration = requiresRegistration != null ? requiresRegistration : true;
        updateLastModified();
    }
    
    public boolean isRequiresRegistration() { return Boolean.TRUE.equals(requiresRegistration); }

    public Boolean getIsPublic() { return isPublic; }
    public void setIsPublic(Boolean isPublic) { 
        this.isPublic = isPublic != null ? isPublic : true;
        updateLastModified();
    }
    
    public boolean isPublic() { return Boolean.TRUE.equals(isPublic); }

    public Double getRegistrationFee() { return registrationFee != null ? registrationFee : 0.0; }
    public void setRegistrationFee(Double registrationFee) { 
        this.registrationFee = registrationFee != null ? registrationFee : 0.0;
        updateLastModified();
    }

    public List<String> getRequirements() { 
        return requirements != null ? requirements : new ArrayList<>(); 
    }
    public void setRequirements(List<String> requirements) { 
        this.requirements = requirements != null ? requirements : new ArrayList<>();
        updateLastModified();
    }

    public List<Map<String, Object>> getSchedule() { 
        return schedule != null ? schedule : new ArrayList<>(); 
    }
    public void setSchedule(List<Map<String, Object>> schedule) { 
        this.schedule = schedule != null ? schedule : new ArrayList<>();
        updateLastModified();
    }

    public String getContactPersonName() { return contactPersonName; }
    public void setContactPersonName(String contactPersonName) { 
        this.contactPersonName = contactPersonName;
        updateLastModified();
    }

    public String getContactPersonPhone() { return contactPersonPhone; }
    public void setContactPersonPhone(String contactPersonPhone) { 
        this.contactPersonPhone = contactPersonPhone;
        updateLastModified();
    }

    public String getContactPersonEmail() { return contactPersonEmail; }
    public void setContactPersonEmail(String contactPersonEmail) { 
        this.contactPersonEmail = contactPersonEmail;
        updateLastModified();
    }

    public String getApprovalStatus() { return approvalStatus != null ? approvalStatus : "PENDING"; }
    public void setApprovalStatus(String approvalStatus) { 
        this.approvalStatus = approvalStatus != null ? approvalStatus : "PENDING";
        updateLastModified();
    }

    public String getApprovedBy() { return approvedBy; }
    public void setApprovedBy(String approvedBy) { 
        this.approvedBy = approvedBy;
        updateLastModified();
    }

    public LocalDateTime getApprovalDate() { return approvalDate; }
    public void setApprovalDate(LocalDateTime approvalDate) { 
        this.approvalDate = approvalDate;
        updateLastModified();
    }

    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { 
        this.rejectionReason = rejectionReason;
        updateLastModified();
    }

    public List<String> getModerationNotes() { 
        return moderationNotes != null ? moderationNotes : new ArrayList<>(); 
    }
    public void setModerationNotes(List<String> moderationNotes) { 
        this.moderationNotes = moderationNotes != null ? moderationNotes : new ArrayList<>();
        updateLastModified();
    }

    public Integer getViewCount() { return viewCount != null ? viewCount : 0; }
    public void setViewCount(Integer viewCount) { 
        this.viewCount = viewCount != null ? viewCount : 0;
    }

    public Integer getShareCount() { return shareCount != null ? shareCount : 0; }
    public void setShareCount(Integer shareCount) { 
        this.shareCount = shareCount != null ? shareCount : 0;
    }

    public Integer getInterestedCount() { return interestedCount != null ? interestedCount : 0; }
    public void setInterestedCount(Integer interestedCount) { 
        this.interestedCount = interestedCount != null ? interestedCount : 0;
    }

    public Map<String, Integer> getParticipantsByType() { 
        return participantsByType != null ? participantsByType : new HashMap<>(); 
    }
    public void setParticipantsByType(Map<String, Integer> participantsByType) { 
        this.participantsByType = participantsByType != null ? participantsByType : new HashMap<>();
        updateLastModified();
    }

    public String getEventReport() { return eventReport; }
    public void setEventReport(String eventReport) { 
        this.eventReport = eventReport;
        updateLastModified();
    }

    public List<String> getAchievements() { 
        return achievements != null ? achievements : new ArrayList<>(); 
    }
    public void setAchievements(List<String> achievements) { 
        this.achievements = achievements != null ? achievements : new ArrayList<>();
        updateLastModified();
    }

    public Map<String, Object> getImpactMetrics() { 
        return impactMetrics != null ? impactMetrics : new HashMap<>(); 
    }
    public void setImpactMetrics(Map<String, Object> impactMetrics) { 
        this.impactMetrics = impactMetrics != null ? impactMetrics : new HashMap<>();
        updateLastModified();
    }

    public List<String> getTestimonials() { 
        return testimonials != null ? testimonials : new ArrayList<>(); 
    }
    public void setTestimonials(List<String> testimonials) { 
        this.testimonials = testimonials != null ? testimonials : new ArrayList<>();
        updateLastModified();
    }

    public List<Map<String, Object>> getDonations() { 
        return donations != null ? donations : new ArrayList<>(); 
    }
    public void setDonations(List<Map<String, Object>> donations) { 
        this.donations = donations != null ? donations : new ArrayList<>();
        updateLastModified();
    }

    public List<Map<String, Object>> getSponsorships() { 
        return sponsorships != null ? sponsorships : new ArrayList<>(); 
    }
    public void setSponsorships(List<Map<String, Object>> sponsorships) { 
        this.sponsorships = sponsorships != null ? sponsorships : new ArrayList<>();
        updateLastModified();
    }

    public Map<String, Double> getDonationsByCategory() { 
        return donationsByCategory != null ? donationsByCategory : new HashMap<>(); 
    }
    public void setDonationsByCategory(Map<String, Double> donationsByCategory) { 
        this.donationsByCategory = donationsByCategory != null ? donationsByCategory : new HashMap<>();
        updateLastModified();
    }

    public List<String> getRegisteredParticipants() { 
        return registeredParticipants != null ? registeredParticipants : new ArrayList<>(); 
    }
    public void setRegisteredParticipants(List<String> registeredParticipants) { 
        this.registeredParticipants = registeredParticipants != null ? registeredParticipants : new ArrayList<>();
        this.currentParticipants = this.registeredParticipants.size();
        updateLastModified();
    }

    public List<String> getVolunteers() { 
        return volunteers != null ? volunteers : new ArrayList<>(); 
    }
    public void setVolunteers(List<String> volunteers) { 
        this.volunteers = volunteers != null ? volunteers : new ArrayList<>();
        this.registeredVolunteers = this.volunteers.size();
        updateLastModified();
    }

    public List<String> getSpeakers() { 
        return speakers != null ? speakers : new ArrayList<>(); 
    }
    public void setSpeakers(List<String> speakers) { 
        this.speakers = speakers != null ? speakers : new ArrayList<>();
        updateLastModified();
    }

    public Boolean getAllowDonations() { return allowDonations; }
    public void setAllowDonations(Boolean allowDonations) { 
        this.allowDonations = allowDonations != null ? allowDonations : true;
        updateLastModified();
    }
    
    public boolean isAllowDonations() { return Boolean.TRUE.equals(allowDonations); }

    public Boolean getAllowVolunteers() { return allowVolunteers; }
    public void setAllowVolunteers(Boolean allowVolunteers) { 
        this.allowVolunteers = allowVolunteers != null ? allowVolunteers : true;
        updateLastModified();
    }
    
    public boolean isAllowVolunteers() { return Boolean.TRUE.equals(allowVolunteers); }

    public Boolean getSendReminders() { return sendReminders; }
    public void setSendReminders(Boolean sendReminders) { 
        this.sendReminders = sendReminders != null ? sendReminders : true;
        updateLastModified();
    }
    
    public boolean isSendReminders() { return Boolean.TRUE.equals(sendReminders); }

    public Boolean getIsRecurring() { return isRecurring; }
    public void setIsRecurring(Boolean isRecurring) { 
        this.isRecurring = isRecurring != null ? isRecurring : false;
        updateLastModified();
    }
    
    public boolean isRecurring() { return Boolean.TRUE.equals(isRecurring); }

    public String getRecurringPattern() { return recurringPattern; }
    public void setRecurringPattern(String recurringPattern) { 
        this.recurringPattern = recurringPattern;
        updateLastModified();
    }

    public Map<String, String> getSocialMediaLinks() { 
        return socialMediaLinks != null ? socialMediaLinks : new HashMap<>(); 
    }
    public void setSocialMediaLinks(Map<String, String> socialMediaLinks) { 
        this.socialMediaLinks = socialMediaLinks != null ? socialMediaLinks : new HashMap<>();
        updateLastModified();
    }

    public String getHashtags() { return hashtags; }
    public void setHashtags(String hashtags) { 
        this.hashtags = hashtags;
        updateLastModified();
    }

    public Boolean getShareOnSocialMedia() { return shareOnSocialMedia; }
    public void setShareOnSocialMedia(Boolean shareOnSocialMedia) { 
        this.shareOnSocialMedia = shareOnSocialMedia != null ? shareOnSocialMedia : true;
        updateLastModified();
    }
    
    public boolean isShareOnSocialMedia() { return Boolean.TRUE.equals(shareOnSocialMedia); }

    public LocalDateTime getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDateTime createdDate) { this.createdDate = createdDate; }

    public LocalDateTime getLastModifiedDate() { return lastModifiedDate; }
    public void setLastModifiedDate(LocalDateTime lastModifiedDate) { this.lastModifiedDate = lastModifiedDate; }

    public LocalDateTime getPublishedDate() { return publishedDate; }
    public void setPublishedDate(LocalDateTime publishedDate) { 
        this.publishedDate = publishedDate;
        updateLastModified();
    }

    public LocalDateTime getCompletedDate() { return completedDate; }
    public void setCompletedDate(LocalDateTime completedDate) { 
        this.completedDate = completedDate;
        updateLastModified();
    }

    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

    public String getLastModifiedBy() { return lastModifiedBy; }
    public void setLastModifiedBy(String lastModifiedBy) { this.lastModifiedBy = lastModifiedBy; }

    public List<String> getEditHistory() { 
        return editHistory != null ? editHistory : new ArrayList<>(); 
    }
    public void setEditHistory(List<String> editHistory) { 
        this.editHistory = editHistory != null ? editHistory : new ArrayList<>(); 
    }

    @Override
    public String toString() {
        return "Event{" +
                "eventId='" + eventId + '\'' +
                ", title='" + title + '\'' +
                ", eventType='" + eventType + '\'' +
                ", status='" + status + '\'' +
                ", organizerId='" + organizerId + '\'' +
                ", organizerName='" + organizerName + '\'' +
                ", eventDate=" + eventDate +
                ", targetAmount=" + targetAmount +
                ", raisedAmount=" + raisedAmount +
                ", currentParticipants=" + currentParticipants +
                ", maxParticipants=" + maxParticipants +
                ", approvalStatus='" + approvalStatus + '\'' +
                '}';
    }
}
