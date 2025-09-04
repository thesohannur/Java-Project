package com.lab.BackEnd.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.TextIndexed;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import java.util.HashMap;

@Document(collection = "ngos")
@CompoundIndex(def = "{'country': 1, 'state': 1, 'city': 1}")
@CompoundIndex(def = "{'status': 1, 'isVerified': 1}")
@CompoundIndex(def = "{'focusAreas': 1, 'isVerified': 1}")
public class NGO {
    @Id
    private String ngoId;

    @Indexed(unique = true)
    private String email;

    @Indexed(unique = true)
    private String registrationNumber;

    @TextIndexed(weight = 2)
    private String organizationName;
    
    private String contactPerson;
    private String phoneNumber;
    private String address;
    private String website;
    
    @TextIndexed
    private String description;
    
    @Indexed
    private List<String> focusAreas = new ArrayList<>();
    
    private String logo;
    
    @Indexed
    private Boolean isVerified = false;
    
    private Double totalReceived = 0.0;
    
    @CreatedDate
    @Indexed
    private LocalDateTime registrationDate = LocalDateTime.now();
    
    @LastModifiedDate
    private LocalDateTime lastModifiedDate = LocalDateTime.now();
    
    @JsonIgnore
    private String userId;

    // Dashboard-specific fields
    private Integer totalDonors = 0;
    private Integer activeCampaigns = 0;
    private Integer completedProjects = 0;
    private Double monthlyGoal = 0.0;
    private Double currentMonthReceived = 0.0;
    
    @Indexed
    private String status = "ACTIVE"; // ACTIVE, INACTIVE, SUSPENDED, PENDING
    
    private List<String> certifications = new ArrayList<>();
    
    // Financial Information - Sensitive data
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String bankAccountNumber;
    
    private String bankName;
    private String taxId;
    
    // Social media links
    private String facebookUrl;
    private String twitterUrl;
    private String linkedinUrl;
    private String instagramUrl;
    
    // Extended contact details
    private String alternateEmail;
    private String alternatePhone;
    
    @Indexed
    private String country = "Bangladesh";
    
    @Indexed
    private String state;
    
    @Indexed
    private String city;
    
    private String zipCode;
    
    // Performance metrics
    private Double impactScore = 0.0;
    private Integer beneficiariesReached = 0;
    private Map<String, Double> categoryWiseDonations = new HashMap<>();
    private List<String> recentActivities = new ArrayList<>();
    
    // Verification system
    private List<String> verificationDocuments = new ArrayList<>();
    private LocalDateTime lastVerificationDate;
    
    @Indexed
    private String verificationStatus = "PENDING"; // PENDING, VERIFIED, REJECTED, UNDER_REVIEW
    
    private String verificationNotes;
    private String verifiedBy; // Admin ID who verified
    
    // Settings and preferences
    private Boolean emailNotifications = true;
    private Boolean smsNotifications = false;
    private String preferredLanguage = "en";
    private String timezone = "Asia/Dhaka";
    
    // Additional organizational details
    private String organizationType = "NGO"; // NGO, CHARITY, FOUNDATION, TRUST, SOCIETY
    private String primaryCategory;
    private Integer establishmentYear;
    private String missionStatement;
    private String visionStatement;
    private Integer teamSize;
    private Integer volunteerCount;
    private List<String> organizationImages = new ArrayList<>();
    
    // Target beneficiaries
    private Integer targetBeneficiaries;
    
    // Security and audit fields
    @JsonIgnore
    private String passwordHash; // If storing password hash
    
    @JsonIgnore
    private List<String> loginHistory = new ArrayList<>();
    
    @JsonIgnore
    private LocalDateTime lastLoginDate;
    
    @JsonIgnore
    private Integer failedLoginAttempts = 0;
    
    @JsonIgnore
    private LocalDateTime accountLockedUntil;
    
    // Subscription and plan information
    private String subscriptionPlan = "FREE"; // FREE, BASIC, PREMIUM
    private LocalDateTime subscriptionExpiry;
    
    // Rating and reviews
    private Double averageRating = 0.0;
    private Integer totalReviews = 0;

    // Constructors
    public NGO() {
        this.registrationDate = LocalDateTime.now();
        this.lastModifiedDate = LocalDateTime.now();
        this.focusAreas = new ArrayList<>();
        this.certifications = new ArrayList<>();
        this.verificationDocuments = new ArrayList<>();
        this.recentActivities = new ArrayList<>();
        this.categoryWiseDonations = new HashMap<>();
        this.organizationImages = new ArrayList<>();
        this.loginHistory = new ArrayList<>();
    }

    public NGO(String email, String organizationName, String registrationNumber) {
        this();
        this.email = email;
        this.organizationName = organizationName;
        this.registrationNumber = registrationNumber;
    }

    // Utility methods
    public boolean isActive() {
        return "ACTIVE".equals(this.status);
    }
    
    public boolean isVerifiedNGO() {
        return Boolean.TRUE.equals(this.isVerified) && "VERIFIED".equals(this.verificationStatus);
    }
    
    public boolean isAccountLocked() {
        return accountLockedUntil != null && accountLockedUntil.isAfter(LocalDateTime.now());
    }
    
    public double getGoalProgress() {
        if (monthlyGoal == null || monthlyGoal <= 0) return 0.0;
        return Math.min((currentMonthReceived / monthlyGoal) * 100, 100.0);
    }
    
    public void addRecentActivity(String activity) {
        if (recentActivities == null) {
            recentActivities = new ArrayList<>();
        }
        recentActivities.add(0, activity); // Add to beginning
        // Keep only last 50 activities
        if (recentActivities.size() > 50) {
            recentActivities = recentActivities.subList(0, 50);
        }
    }
    
    public void updateLastModified() {
        this.lastModifiedDate = LocalDateTime.now();
    }

    // Existing Getters and Setters with null safety
    public String getNgoId() { return ngoId; }
    public void setNgoId(String ngoId) { this.ngoId = ngoId; }

    public String getEmail() { return email; }
    public void setEmail(String email) { 
        this.email = email;
        updateLastModified();
    }

    public String getRegistrationNumber() { return registrationNumber; }
    public void setRegistrationNumber(String registrationNumber) { 
        this.registrationNumber = registrationNumber;
        updateLastModified();
    }

    public String getOrganizationName() { return organizationName; }
    public void setOrganizationName(String organizationName) { 
        this.organizationName = organizationName;
        updateLastModified();
    }

    public String getContactPerson() { return contactPerson; }
    public void setContactPerson(String contactPerson) { 
        this.contactPerson = contactPerson;
        updateLastModified();
    }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { 
        this.phoneNumber = phoneNumber;
        updateLastModified();
    }

    public String getAddress() { return address; }
    public void setAddress(String address) { 
        this.address = address;
        updateLastModified();
    }

    public String getWebsite() { return website; }
    public void setWebsite(String website) { 
        this.website = website;
        updateLastModified();
    }

    public String getDescription() { return description; }
    public void setDescription(String description) { 
        this.description = description;
        updateLastModified();
    }

    public List<String> getFocusAreas() { 
        return focusAreas != null ? focusAreas : new ArrayList<>(); 
    }
    public void setFocusAreas(List<String> focusAreas) { 
        this.focusAreas = focusAreas != null ? focusAreas : new ArrayList<>();
        updateLastModified();
    }

    public String getLogo() { return logo; }
    public void setLogo(String logo) { 
        this.logo = logo;
        updateLastModified();
    }

    public Boolean getIsVerified() { return isVerified; }
    public void setIsVerified(Boolean verified) { 
        this.isVerified = verified;
        updateLastModified();
    }
    
    // Backward compatibility
    public boolean isVerified() { return Boolean.TRUE.equals(isVerified); }
    public void setVerified(boolean verified) { setIsVerified(verified); }

    public Double getTotalReceived() { return totalReceived != null ? totalReceived : 0.0; }
    public void setTotalReceived(Double totalReceived) { 
        this.totalReceived = totalReceived != null ? totalReceived : 0.0;
        updateLastModified();
    }

    public LocalDateTime getRegistrationDate() { return registrationDate; }
    public void setRegistrationDate(LocalDateTime registrationDate) { 
        this.registrationDate = registrationDate;
    }

    public LocalDateTime getLastModifiedDate() { return lastModifiedDate; }
    public void setLastModifiedDate(LocalDateTime lastModifiedDate) { 
        this.lastModifiedDate = lastModifiedDate;
    }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    // Dashboard-specific getters and setters
    public Integer getTotalDonors() { return totalDonors != null ? totalDonors : 0; }
    public void setTotalDonors(Integer totalDonors) { 
        this.totalDonors = totalDonors != null ? totalDonors : 0;
        updateLastModified();
    }

    public Integer getActiveCampaigns() { return activeCampaigns != null ? activeCampaigns : 0; }
    public void setActiveCampaigns(Integer activeCampaigns) { 
        this.activeCampaigns = activeCampaigns != null ? activeCampaigns : 0;
        updateLastModified();
    }

    public Integer getCompletedProjects() { return completedProjects != null ? completedProjects : 0; }
    public void setCompletedProjects(Integer completedProjects) { 
        this.completedProjects = completedProjects != null ? completedProjects : 0;
        updateLastModified();
    }

    public Double getMonthlyGoal() { return monthlyGoal != null ? monthlyGoal : 0.0; }
    public void setMonthlyGoal(Double monthlyGoal) { 
        this.monthlyGoal = monthlyGoal != null ? monthlyGoal : 0.0;
        updateLastModified();
    }

    public Double getCurrentMonthReceived() { return currentMonthReceived != null ? currentMonthReceived : 0.0; }
    public void setCurrentMonthReceived(Double currentMonthReceived) { 
        this.currentMonthReceived = currentMonthReceived != null ? currentMonthReceived : 0.0;
        updateLastModified();
    }

    public String getStatus() { return status != null ? status : "ACTIVE"; }
    public void setStatus(String status) { 
        this.status = status != null ? status : "ACTIVE";
        updateLastModified();
    }

    public List<String> getCertifications() { 
        return certifications != null ? certifications : new ArrayList<>(); 
    }
    public void setCertifications(List<String> certifications) { 
        this.certifications = certifications != null ? certifications : new ArrayList<>();
        updateLastModified();
    }

    public String getBankAccountNumber() { return bankAccountNumber; }
    public void setBankAccountNumber(String bankAccountNumber) { 
        this.bankAccountNumber = bankAccountNumber;
        updateLastModified();
    }

    public String getBankName() { return bankName; }
    public void setBankName(String bankName) { 
        this.bankName = bankName;
        updateLastModified();
    }

    public String getTaxId() { return taxId; }
    public void setTaxId(String taxId) { 
        this.taxId = taxId;
        updateLastModified();
    }

    // Social media getters and setters
    public String getFacebookUrl() { return facebookUrl; }
    public void setFacebookUrl(String facebookUrl) { 
        this.facebookUrl = facebookUrl;
        updateLastModified();
    }

    public String getTwitterUrl() { return twitterUrl; }
    public void setTwitterUrl(String twitterUrl) { 
        this.twitterUrl = twitterUrl;
        updateLastModified();
    }

    public String getLinkedinUrl() { return linkedinUrl; }
    public void setLinkedinUrl(String linkedinUrl) { 
        this.linkedinUrl = linkedinUrl;
        updateLastModified();
    }

    public String getInstagramUrl() { return instagramUrl; }
    public void setInstagramUrl(String instagramUrl) { 
        this.instagramUrl = instagramUrl;
        updateLastModified();
    }

    // Contact details
    public String getAlternateEmail() { return alternateEmail; }
    public void setAlternateEmail(String alternateEmail) { 
        this.alternateEmail = alternateEmail;
        updateLastModified();
    }

    public String getAlternatePhone() { return alternatePhone; }
    public void setAlternatePhone(String alternatePhone) { 
        this.alternatePhone = alternatePhone;
        updateLastModified();
    }

    public String getCountry() { return country != null ? country : "Bangladesh"; }
    public void setCountry(String country) { 
        this.country = country != null ? country : "Bangladesh";
        updateLastModified();
    }

    public String getState() { return state; }
    public void setState(String state) { 
        this.state = state;
        updateLastModified();
    }

    public String getCity() { return city; }
    public void setCity(String city) { 
        this.city = city;
        updateLastModified();
    }

    public String getZipCode() { return zipCode; }
    public void setZipCode(String zipCode) { 
        this.zipCode = zipCode;
        updateLastModified();
    }

    // Performance metrics
    public Double getImpactScore() { return impactScore != null ? impactScore : 0.0; }
    public void setImpactScore(Double impactScore) { 
        this.impactScore = impactScore != null ? impactScore : 0.0;
        updateLastModified();
    }

    public Integer getBeneficiariesReached() { return beneficiariesReached != null ? beneficiariesReached : 0; }
    public void setBeneficiariesReached(Integer beneficiariesReached) { 
        this.beneficiariesReached = beneficiariesReached != null ? beneficiariesReached : 0;
        updateLastModified();
    }

    public Map<String, Double> getCategoryWiseDonations() { 
        return categoryWiseDonations != null ? categoryWiseDonations : new HashMap<>(); 
    }
    public void setCategoryWiseDonations(Map<String, Double> categoryWiseDonations) { 
        this.categoryWiseDonations = categoryWiseDonations != null ? categoryWiseDonations : new HashMap<>();
        updateLastModified();
    }

    public List<String> getRecentActivities() { 
        return recentActivities != null ? recentActivities : new ArrayList<>(); 
    }
    public void setRecentActivities(List<String> recentActivities) { 
        this.recentActivities = recentActivities != null ? recentActivities : new ArrayList<>();
        updateLastModified();
    }

    // Verification
    public List<String> getVerificationDocuments() { 
        return verificationDocuments != null ? verificationDocuments : new ArrayList<>(); 
    }
    public void setVerificationDocuments(List<String> verificationDocuments) { 
        this.verificationDocuments = verificationDocuments != null ? verificationDocuments : new ArrayList<>();
        updateLastModified();
    }

    public LocalDateTime getLastVerificationDate() { return lastVerificationDate; }
    public void setLastVerificationDate(LocalDateTime lastVerificationDate) { 
        this.lastVerificationDate = lastVerificationDate;
        updateLastModified();
    }

    public String getVerificationStatus() { return verificationStatus != null ? verificationStatus : "PENDING"; }
    public void setVerificationStatus(String verificationStatus) { 
        this.verificationStatus = verificationStatus != null ? verificationStatus : "PENDING";
        updateLastModified();
    }

    public String getVerificationNotes() { return verificationNotes; }
    public void setVerificationNotes(String verificationNotes) { 
        this.verificationNotes = verificationNotes;
        updateLastModified();
    }

    public String getVerifiedBy() { return verifiedBy; }
    public void setVerifiedBy(String verifiedBy) { 
        this.verifiedBy = verifiedBy;
        updateLastModified();
    }

    // Settings
    public Boolean getEmailNotifications() { return emailNotifications; }
    public void setEmailNotifications(Boolean emailNotifications) { 
        this.emailNotifications = emailNotifications != null ? emailNotifications : true;
        updateLastModified();
    }
    
    // Backward compatibility
    public boolean isEmailNotifications() { return Boolean.TRUE.equals(emailNotifications); }

    public Boolean getSmsNotifications() { return smsNotifications; }
    public void setSmsNotifications(Boolean smsNotifications) { 
        this.smsNotifications = smsNotifications != null ? smsNotifications : false;
        updateLastModified();
    }
    
    // Backward compatibility
    public boolean isSmsNotifications() { return Boolean.TRUE.equals(smsNotifications); }

    public String getPreferredLanguage() { return preferredLanguage != null ? preferredLanguage : "en"; }
    public void setPreferredLanguage(String preferredLanguage) { 
        this.preferredLanguage = preferredLanguage != null ? preferredLanguage : "en";
        updateLastModified();
    }

    public String getTimezone() { return timezone != null ? timezone : "Asia/Dhaka"; }
    public void setTimezone(String timezone) { 
        this.timezone = timezone != null ? timezone : "Asia/Dhaka";
        updateLastModified();
    }

    // Additional organizational details
    public String getOrganizationType() { return organizationType != null ? organizationType : "NGO"; }
    public void setOrganizationType(String organizationType) { 
        this.organizationType = organizationType != null ? organizationType : "NGO";
        updateLastModified();
    }

    public String getPrimaryCategory() { return primaryCategory; }
    public void setPrimaryCategory(String primaryCategory) { 
        this.primaryCategory = primaryCategory;
        updateLastModified();
    }

    public Integer getEstablishmentYear() { return establishmentYear; }
    public void setEstablishmentYear(Integer establishmentYear) { 
        this.establishmentYear = establishmentYear;
        updateLastModified();
    }

    public String getMissionStatement() { return missionStatement; }
    public void setMissionStatement(String missionStatement) { 
        this.missionStatement = missionStatement;
        updateLastModified();
    }

    public String getVisionStatement() { return visionStatement; }
    public void setVisionStatement(String visionStatement) { 
        this.visionStatement = visionStatement;
        updateLastModified();
    }

    public Integer getTeamSize() { return teamSize; }
    public void setTeamSize(Integer teamSize) { 
        this.teamSize = teamSize;
        updateLastModified();
    }

    public Integer getVolunteerCount() { return volunteerCount; }
    public void setVolunteerCount(Integer volunteerCount) { 
        this.volunteerCount = volunteerCount;
        updateLastModified();
    }

    public List<String> getOrganizationImages() { 
        return organizationImages != null ? organizationImages : new ArrayList<>(); 
    }
    public void setOrganizationImages(List<String> organizationImages) { 
        this.organizationImages = organizationImages != null ? organizationImages : new ArrayList<>();
        updateLastModified();
    }

    public Integer getTargetBeneficiaries() { return targetBeneficiaries; }
    public void setTargetBeneficiaries(Integer targetBeneficiaries) { 
        this.targetBeneficiaries = targetBeneficiaries;
        updateLastModified();
    }

    // Security fields (JsonIgnore getters/setters)
    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public List<String> getLoginHistory() { 
        return loginHistory != null ? loginHistory : new ArrayList<>(); 
    }
    public void setLoginHistory(List<String> loginHistory) { 
        this.loginHistory = loginHistory != null ? loginHistory : new ArrayList<>(); 
    }

    public LocalDateTime getLastLoginDate() { return lastLoginDate; }
    public void setLastLoginDate(LocalDateTime lastLoginDate) { this.lastLoginDate = lastLoginDate; }

    public Integer getFailedLoginAttempts() { return failedLoginAttempts != null ? failedLoginAttempts : 0; }
    public void setFailedLoginAttempts(Integer failedLoginAttempts) { 
        this.failedLoginAttempts = failedLoginAttempts != null ? failedLoginAttempts : 0; 
    }

    public LocalDateTime getAccountLockedUntil() { return accountLockedUntil; }
    public void setAccountLockedUntil(LocalDateTime accountLockedUntil) { this.accountLockedUntil = accountLockedUntil; }

    // Subscription
    public String getSubscriptionPlan() { return subscriptionPlan != null ? subscriptionPlan : "FREE"; }
    public void setSubscriptionPlan(String subscriptionPlan) { 
        this.subscriptionPlan = subscriptionPlan != null ? subscriptionPlan : "FREE";
        updateLastModified();
    }

    public LocalDateTime getSubscriptionExpiry() { return subscriptionExpiry; }
    public void setSubscriptionExpiry(LocalDateTime subscriptionExpiry) { 
        this.subscriptionExpiry = subscriptionExpiry;
        updateLastModified();
    }

    // Rating
    public Double getAverageRating() { return averageRating != null ? averageRating : 0.0; }
    public void setAverageRating(Double averageRating) { 
        this.averageRating = averageRating != null ? averageRating : 0.0;
        updateLastModified();
    }

    public Integer getTotalReviews() { return totalReviews != null ? totalReviews : 0; }
    public void setTotalReviews(Integer totalReviews) { 
        this.totalReviews = totalReviews != null ? totalReviews : 0;
        updateLastModified();
    }

    @Override
    public String toString() {
        return "NGO{" +
                "ngoId='" + ngoId + '\'' +
                ", email='" + email + '\'' +
                ", organizationName='" + organizationName + '\'' +
                ", registrationNumber='" + registrationNumber + '\'' +
                ", status='" + status + '\'' +
                ", isVerified=" + isVerified +
                ", verificationStatus='" + verificationStatus + '\'' +
                ", country='" + country + '\'' +
                ", state='" + state + '\'' +
                ", city='" + city + '\'' +
                '}';
    }
}
