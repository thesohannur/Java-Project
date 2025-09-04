package com.lab.BackEnd.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import java.util.HashMap;

@Document(collection = "admins")
@CompoundIndex(def = "{'adminLevel': 1, 'isActive': 1}")
@CompoundIndex(def = "{'department': 1, 'adminLevel': 1}")
public class Admin {
    @Id
    private String adminId;

    @Indexed(unique = true)
    private String email;

    private String fullName;
    private String profileImage;
    
    @CreatedDate
    @Indexed
    private LocalDateTime registrationDate = LocalDateTime.now();
    
    @LastModifiedDate
    private LocalDateTime lastModifiedDate = LocalDateTime.now();
    
    private LocalDateTime lastLogin;
    
    @JsonIgnore
    private String userId;

    // Admin-specific fields
    @Indexed
    private String adminLevel = "MODERATOR"; // SUPER_ADMIN, ADMIN, MODERATOR, SUPPORT
    
    @Indexed
    private String department = "GENERAL"; // GENERAL, NGO_VERIFICATION, DONOR_SUPPORT, FINANCE, TECHNICAL
    
    @Indexed
    private Boolean isActive = true;
    
    @Indexed
    private Boolean isSuperAdmin = false;
    
    private String employeeId;
    private String designation;
    private LocalDateTime joiningDate = LocalDateTime.now();
    
    // Contact Information
    private String phoneNumber;
    private String alternateEmail;
    private String address;
    private String emergencyContact;
    private String emergencyContactPhone;
    
    // Location
    private String country = "Bangladesh";
    private String state;
    private String city;
    private String workLocation = "HEAD_OFFICE"; // HEAD_OFFICE, REMOTE, FIELD_OFFICE
    
    // Permissions and Access Control
    private List<String> permissions = new ArrayList<>();
    private List<String> accessibleModules = new ArrayList<>();
    private Map<String, Boolean> modulePermissions = new HashMap<>();
    
    // Admin Activity Tracking
    private Integer totalNGOsVerified = 0;
    private Integer totalDonorsAssisted = 0;
    private Integer totalTicketsResolved = 0;
    private Integer totalReportsGenerated = 0;
    private Double performanceScore = 0.0;
    
    // Recent Activities
    private List<String> recentActivities = new ArrayList<>();
    private Map<String, Integer> dailyActivityCount = new HashMap<>();
    private LocalDateTime lastActivityDate;
    
    // Verification and Approval Statistics
    private Integer ngoApprovals = 0;
    private Integer ngoRejections = 0;
    private Integer donorVerifications = 0;
    private Integer campaignApprovals = 0;
    private Integer reportReviews = 0;
    
    // Security and Audit
    @JsonIgnore
    private String passwordHash;
    
    @JsonIgnore
    private List<String> loginHistory = new ArrayList<>();
    
    @JsonIgnore
    private Integer failedLoginAttempts = 0;
    
    @JsonIgnore
    private LocalDateTime accountLockedUntil;
    
    @JsonIgnore
    private String twoFactorSecret;
    
    @JsonIgnore
    private Boolean twoFactorEnabled = false;
    
    // Session Management
    @JsonIgnore
    private List<String> activeSessions = new ArrayList<>();
    
    @JsonIgnore
    private LocalDateTime lastPasswordChange;
    
    @JsonIgnore
    private Boolean forcePasswordChange = false;
    
    // Admin Settings and Preferences
    private String preferredLanguage = "en";
    private String timezone = "Asia/Dhaka";
    private String theme = "LIGHT"; // LIGHT, DARK, AUTO
    private Boolean emailNotifications = true;
    private Boolean systemAlerts = true;
    private Boolean reportNotifications = true;
    
    // Dashboard Preferences
    private Map<String, Object> dashboardConfig = new HashMap<>();
    private List<String> favoriteReports = new ArrayList<>();
    private Map<String, String> quickActions = new HashMap<>();
    
    // Supervision and Hierarchy
    private String supervisorId;
    private List<String> subordinateIds = new ArrayList<>();
    private String reportingManager;
    
    // Work Schedule and Availability
    private String workShift = "DAY"; // DAY, NIGHT, FLEXIBLE
    private Map<String, String> workingHours = new HashMap<>();
    private Boolean isAvailable = true;
    private String availabilityStatus = "ONLINE"; // ONLINE, OFFLINE, BUSY, AWAY
    
    // Performance Metrics
    private Double monthlyPerformanceScore = 0.0;
    private Integer tasksCompleted = 0;
    private Integer tasksAssigned = 0;
    private Double averageResponseTime = 0.0; // in minutes
    private Double customerSatisfactionRating = 0.0;
    
    // Training and Certifications
    private List<String> certifications = new ArrayList<>();
    private List<String> trainingCompleted = new ArrayList<>();
    private LocalDateTime lastTrainingDate;
    private String trainingStatus = "UP_TO_DATE"; // UP_TO_DATE, PENDING, OVERDUE
    
    // System Access Logs
    private Map<String, LocalDateTime> moduleLastAccessed = new HashMap<>();
    private Integer totalSystemAccess = 0;
    private LocalDateTime firstLoginDate;

    // Constructors
    public Admin() {
        this.registrationDate = LocalDateTime.now();
        this.lastModifiedDate = LocalDateTime.now();
        this.joiningDate = LocalDateTime.now();
        this.permissions = new ArrayList<>();
        this.accessibleModules = new ArrayList<>();
        this.modulePermissions = new HashMap<>();
        this.recentActivities = new ArrayList<>();
        this.dailyActivityCount = new HashMap<>();
        this.loginHistory = new ArrayList<>();
        this.activeSessions = new ArrayList<>();
        this.dashboardConfig = new HashMap<>();
        this.favoriteReports = new ArrayList<>();
        this.quickActions = new HashMap<>();
        this.subordinateIds = new ArrayList<>();
        this.workingHours = new HashMap<>();
        this.certifications = new ArrayList<>();
        this.trainingCompleted = new ArrayList<>();
        this.moduleLastAccessed = new HashMap<>();
        
        // Initialize default permissions based on admin level
        initializeDefaultPermissions();
    }

    public Admin(String email, String fullName, String adminLevel) {
        this();
        this.email = email;
        this.fullName = fullName;
        this.adminLevel = adminLevel;
        initializeDefaultPermissions();
    }

    // Utility methods
    private void initializeDefaultPermissions() {
        permissions.clear();
        accessibleModules.clear();
        
        switch (adminLevel != null ? adminLevel : "MODERATOR") {
            case "SUPER_ADMIN":
                permissions.addAll(List.of("ALL_ACCESS", "USER_MANAGEMENT", "SYSTEM_CONFIG", "DATA_EXPORT", "AUDIT_LOGS"));
                accessibleModules.addAll(List.of("DASHBOARD", "NGO_MANAGEMENT", "DONOR_MANAGEMENT", "REPORTS", "SETTINGS", "AUDIT", "SYSTEM"));
                isSuperAdmin = true;
                break;
            case "ADMIN":
                permissions.addAll(List.of("NGO_VERIFY", "DONOR_SUPPORT", "REPORT_GENERATE", "USER_MODERATE"));
                accessibleModules.addAll(List.of("DASHBOARD", "NGO_MANAGEMENT", "DONOR_MANAGEMENT", "REPORTS", "SUPPORT"));
                break;
            case "MODERATOR":
                permissions.addAll(List.of("NGO_REVIEW", "CONTENT_MODERATE", "BASIC_SUPPORT"));
                accessibleModules.addAll(List.of("DASHBOARD", "NGO_REVIEW", "CONTENT", "SUPPORT"));
                break;
            case "SUPPORT":
                permissions.addAll(List.of("TICKET_RESOLVE", "DONOR_ASSIST", "BASIC_REPORTS"));
                accessibleModules.addAll(List.of("DASHBOARD", "SUPPORT", "TICKETS"));
                break;
        }
    }
    
    public boolean hasPermission(String permission) {
        return permissions != null && (permissions.contains("ALL_ACCESS") || permissions.contains(permission));
    }
    
    public boolean canAccessModule(String module) {
        return accessibleModules != null && accessibleModules.contains(module);
    }
    
    public boolean isAccountLocked() {
        return accountLockedUntil != null && accountLockedUntil.isAfter(LocalDateTime.now());
    }
    
    public boolean isSuperAdminLevel() {
        return Boolean.TRUE.equals(isSuperAdmin) || "SUPER_ADMIN".equals(adminLevel);
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
        this.lastActivityDate = LocalDateTime.now();
        updateLastModified();
    }
    
    public void updatePerformanceMetrics() {
        if (tasksAssigned != null && tasksAssigned > 0) {
            double completionRate = (double) (tasksCompleted != null ? tasksCompleted : 0) / tasksAssigned;
            this.performanceScore = completionRate * 100;
        }
        updateLastModified();
    }
    
    public void updateLastModified() {
        this.lastModifiedDate = LocalDateTime.now();
    }

    // Getters and Setters with null safety and auto-update
    public String getAdminId() { return adminId; }
    public void setAdminId(String adminId) { this.adminId = adminId; }

    public String getEmail() { return email; }
    public void setEmail(String email) { 
        this.email = email;
        updateLastModified();
    }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { 
        this.fullName = fullName;
        updateLastModified();
    }

    public String getProfileImage() { return profileImage; }
    public void setProfileImage(String profileImage) { 
        this.profileImage = profileImage;
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

    public LocalDateTime getLastLogin() { return lastLogin; }
    public void setLastLogin(LocalDateTime lastLogin) { 
        this.lastLogin = lastLogin;
    }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    // Admin-specific getters and setters
    public String getAdminLevel() { return adminLevel != null ? adminLevel : "MODERATOR"; }
    public void setAdminLevel(String adminLevel) { 
        this.adminLevel = adminLevel != null ? adminLevel : "MODERATOR";
        initializeDefaultPermissions(); // Reinitialize permissions when level changes
        updateLastModified();
    }

    public String getDepartment() { return department != null ? department : "GENERAL"; }
    public void setDepartment(String department) { 
        this.department = department != null ? department : "GENERAL";
        updateLastModified();
    }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean active) { 
        this.isActive = active;
        updateLastModified();
    }
    
    // Backward compatibility
    public boolean isActive() { return Boolean.TRUE.equals(isActive); }
    public void setActive(boolean active) { setIsActive(active); }

    public Boolean getIsSuperAdmin() { return isSuperAdmin; }
    public void setIsSuperAdmin(Boolean superAdmin) { 
        this.isSuperAdmin = superAdmin;
        updateLastModified();
    }
    
    // Backward compatibility
    public boolean isSuperAdmin() { return Boolean.TRUE.equals(isSuperAdmin); }
    public void setSuperAdmin(boolean superAdmin) { setIsSuperAdmin(superAdmin); }

    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { 
        this.employeeId = employeeId;
        updateLastModified();
    }

    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { 
        this.designation = designation;
        updateLastModified();
    }

    public LocalDateTime getJoiningDate() { return joiningDate; }
    public void setJoiningDate(LocalDateTime joiningDate) { 
        this.joiningDate = joiningDate;
        updateLastModified();
    }

    // Contact information
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { 
        this.phoneNumber = phoneNumber;
        updateLastModified();
    }

    public String getAlternateEmail() { return alternateEmail; }
    public void setAlternateEmail(String alternateEmail) { 
        this.alternateEmail = alternateEmail;
        updateLastModified();
    }

    public String getAddress() { return address; }
    public void setAddress(String address) { 
        this.address = address;
        updateLastModified();
    }

    public String getEmergencyContact() { return emergencyContact; }
    public void setEmergencyContact(String emergencyContact) { 
        this.emergencyContact = emergencyContact;
        updateLastModified();
    }

    public String getEmergencyContactPhone() { return emergencyContactPhone; }
    public void setEmergencyContactPhone(String emergencyContactPhone) { 
        this.emergencyContactPhone = emergencyContactPhone;
        updateLastModified();
    }

    // Location
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

    public String getWorkLocation() { return workLocation != null ? workLocation : "HEAD_OFFICE"; }
    public void setWorkLocation(String workLocation) { 
        this.workLocation = workLocation != null ? workLocation : "HEAD_OFFICE";
        updateLastModified();
    }

    // Permissions and access
    public List<String> getPermissions() { 
        return permissions != null ? permissions : new ArrayList<>(); 
    }
    public void setPermissions(List<String> permissions) { 
        this.permissions = permissions != null ? permissions : new ArrayList<>();
        updateLastModified();
    }

    public List<String> getAccessibleModules() { 
        return accessibleModules != null ? accessibleModules : new ArrayList<>(); 
    }
    public void setAccessibleModules(List<String> accessibleModules) { 
        this.accessibleModules = accessibleModules != null ? accessibleModules : new ArrayList<>();
        updateLastModified();
    }

    public Map<String, Boolean> getModulePermissions() { 
        return modulePermissions != null ? modulePermissions : new HashMap<>(); 
    }
    public void setModulePermissions(Map<String, Boolean> modulePermissions) { 
        this.modulePermissions = modulePermissions != null ? modulePermissions : new HashMap<>();
        updateLastModified();
    }

    // Activity tracking
    public Integer getTotalNGOsVerified() { return totalNGOsVerified != null ? totalNGOsVerified : 0; }
    public void setTotalNGOsVerified(Integer totalNGOsVerified) { 
        this.totalNGOsVerified = totalNGOsVerified != null ? totalNGOsVerified : 0;
        updateLastModified();
    }

    public Integer getTotalDonorsAssisted() { return totalDonorsAssisted != null ? totalDonorsAssisted : 0; }
    public void setTotalDonorsAssisted(Integer totalDonorsAssisted) { 
        this.totalDonorsAssisted = totalDonorsAssisted != null ? totalDonorsAssisted : 0;
        updateLastModified();
    }

    public Integer getTotalTicketsResolved() { return totalTicketsResolved != null ? totalTicketsResolved : 0; }
    public void setTotalTicketsResolved(Integer totalTicketsResolved) { 
        this.totalTicketsResolved = totalTicketsResolved != null ? totalTicketsResolved : 0;
        updateLastModified();
    }

    public Integer getTotalReportsGenerated() { return totalReportsGenerated != null ? totalReportsGenerated : 0; }
    public void setTotalReportsGenerated(Integer totalReportsGenerated) { 
        this.totalReportsGenerated = totalReportsGenerated != null ? totalReportsGenerated : 0;
        updateLastModified();
    }

    public Double getPerformanceScore() { return performanceScore != null ? performanceScore : 0.0; }
    public void setPerformanceScore(Double performanceScore) { 
        this.performanceScore = performanceScore != null ? performanceScore : 0.0;
        updateLastModified();
    }

    // Recent activities
    public List<String> getRecentActivities() { 
        return recentActivities != null ? recentActivities : new ArrayList<>(); 
    }
    public void setRecentActivities(List<String> recentActivities) { 
        this.recentActivities = recentActivities != null ? recentActivities : new ArrayList<>();
        updateLastModified();
    }

    public Map<String, Integer> getDailyActivityCount() { 
        return dailyActivityCount != null ? dailyActivityCount : new HashMap<>(); 
    }
    public void setDailyActivityCount(Map<String, Integer> dailyActivityCount) { 
        this.dailyActivityCount = dailyActivityCount != null ? dailyActivityCount : new HashMap<>();
        updateLastModified();
    }

    public LocalDateTime getLastActivityDate() { return lastActivityDate; }
    public void setLastActivityDate(LocalDateTime lastActivityDate) { 
        this.lastActivityDate = lastActivityDate;
        updateLastModified();
    }

    // Verification statistics
    public Integer getNgoApprovals() { return ngoApprovals != null ? ngoApprovals : 0; }
    public void setNgoApprovals(Integer ngoApprovals) { 
        this.ngoApprovals = ngoApprovals != null ? ngoApprovals : 0;
        updateLastModified();
    }

    public Integer getNgoRejections() { return ngoRejections != null ? ngoRejections : 0; }
    public void setNgoRejections(Integer ngoRejections) { 
        this.ngoRejections = ngoRejections != null ? ngoRejections : 0;
        updateLastModified();
    }

    public Integer getDonorVerifications() { return donorVerifications != null ? donorVerifications : 0; }
    public void setDonorVerifications(Integer donorVerifications) { 
        this.donorVerifications = donorVerifications != null ? donorVerifications : 0;
        updateLastModified();
    }

    public Integer getCampaignApprovals() { return campaignApprovals != null ? campaignApprovals : 0; }
    public void setCampaignApprovals(Integer campaignApprovals) { 
        this.campaignApprovals = campaignApprovals != null ? campaignApprovals : 0;
        updateLastModified();
    }

    public Integer getReportReviews() { return reportReviews != null ? reportReviews : 0; }
    public void setReportReviews(Integer reportReviews) { 
        this.reportReviews = reportReviews != null ? reportReviews : 0;
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

    public Integer getFailedLoginAttempts() { return failedLoginAttempts != null ? failedLoginAttempts : 0; }
    public void setFailedLoginAttempts(Integer failedLoginAttempts) { 
        this.failedLoginAttempts = failedLoginAttempts != null ? failedLoginAttempts : 0; 
    }

    public LocalDateTime getAccountLockedUntil() { return accountLockedUntil; }
    public void setAccountLockedUntil(LocalDateTime accountLockedUntil) { this.accountLockedUntil = accountLockedUntil; }

    public String getTwoFactorSecret() { return twoFactorSecret; }
    public void setTwoFactorSecret(String twoFactorSecret) { this.twoFactorSecret = twoFactorSecret; }

    public Boolean getTwoFactorEnabled() { return twoFactorEnabled; }
    public void setTwoFactorEnabled(Boolean twoFactorEnabled) { 
        this.twoFactorEnabled = twoFactorEnabled != null ? twoFactorEnabled : false; 
    }
    
    public boolean isTwoFactorEnabled() { return Boolean.TRUE.equals(twoFactorEnabled); }

    public List<String> getActiveSessions() { 
        return activeSessions != null ? activeSessions : new ArrayList<>(); 
    }
    public void setActiveSessions(List<String> activeSessions) { 
        this.activeSessions = activeSessions != null ? activeSessions : new ArrayList<>(); 
    }

    public LocalDateTime getLastPasswordChange() { return lastPasswordChange; }
    public void setLastPasswordChange(LocalDateTime lastPasswordChange) { this.lastPasswordChange = lastPasswordChange; }

    public Boolean getForcePasswordChange() { return forcePasswordChange; }
    public void setForcePasswordChange(Boolean forcePasswordChange) { 
        this.forcePasswordChange = forcePasswordChange != null ? forcePasswordChange : false; 
    }
    
    public boolean isForcePasswordChange() { return Boolean.TRUE.equals(forcePasswordChange); }

    // Settings and preferences
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

    public String getTheme() { return theme != null ? theme : "LIGHT"; }
    public void setTheme(String theme) { 
        this.theme = theme != null ? theme : "LIGHT";
        updateLastModified();
    }

    public Boolean getEmailNotifications() { return emailNotifications; }
    public void setEmailNotifications(Boolean emailNotifications) { 
        this.emailNotifications = emailNotifications != null ? emailNotifications : true;
        updateLastModified();
    }
    
    public boolean isEmailNotifications() { return Boolean.TRUE.equals(emailNotifications); }

    public Boolean getSystemAlerts() { return systemAlerts; }
    public void setSystemAlerts(Boolean systemAlerts) { 
        this.systemAlerts = systemAlerts != null ? systemAlerts : true;
        updateLastModified();
    }
    
    public boolean isSystemAlerts() { return Boolean.TRUE.equals(systemAlerts); }

    public Boolean getReportNotifications() { return reportNotifications; }
    public void setReportNotifications(Boolean reportNotifications) { 
        this.reportNotifications = reportNotifications != null ? reportNotifications : true;
        updateLastModified();
    }
    
    public boolean isReportNotifications() { return Boolean.TRUE.equals(reportNotifications); }

    // Dashboard and preferences
    public Map<String, Object> getDashboardConfig() { 
        return dashboardConfig != null ? dashboardConfig : new HashMap<>(); 
    }
    public void setDashboardConfig(Map<String, Object> dashboardConfig) { 
        this.dashboardConfig = dashboardConfig != null ? dashboardConfig : new HashMap<>();
        updateLastModified();
    }

    public List<String> getFavoriteReports() { 
        return favoriteReports != null ? favoriteReports : new ArrayList<>(); 
    }
    public void setFavoriteReports(List<String> favoriteReports) { 
        this.favoriteReports = favoriteReports != null ? favoriteReports : new ArrayList<>();
        updateLastModified();
    }

    public Map<String, String> getQuickActions() { 
        return quickActions != null ? quickActions : new HashMap<>(); 
    }
    public void setQuickActions(Map<String, String> quickActions) { 
        this.quickActions = quickActions != null ? quickActions : new HashMap<>();
        updateLastModified();
    }

    // Supervision and hierarchy
    public String getSupervisorId() { return supervisorId; }
    public void setSupervisorId(String supervisorId) { 
        this.supervisorId = supervisorId;
        updateLastModified();
    }

    public List<String> getSubordinateIds() { 
        return subordinateIds != null ? subordinateIds : new ArrayList<>(); 
    }
    public void setSubordinateIds(List<String> subordinateIds) { 
        this.subordinateIds = subordinateIds != null ? subordinateIds : new ArrayList<>();
        updateLastModified();
    }

    public String getReportingManager() { return reportingManager; }
    public void setReportingManager(String reportingManager) { 
        this.reportingManager = reportingManager;
        updateLastModified();
    }

    // Work schedule
    public String getWorkShift() { return workShift != null ? workShift : "DAY"; }
    public void setWorkShift(String workShift) { 
        this.workShift = workShift != null ? workShift : "DAY";
        updateLastModified();
    }

    public Map<String, String> getWorkingHours() { 
        return workingHours != null ? workingHours : new HashMap<>(); 
    }
    public void setWorkingHours(Map<String, String> workingHours) { 
        this.workingHours = workingHours != null ? workingHours : new HashMap<>();
        updateLastModified();
    }

    public Boolean getIsAvailable() { return isAvailable; }
    public void setIsAvailable(Boolean available) { 
        this.isAvailable = available;
        updateLastModified();
    }
    
    public boolean isAvailable() { return Boolean.TRUE.equals(isAvailable); }

    public String getAvailabilityStatus() { return availabilityStatus != null ? availabilityStatus : "ONLINE"; }
    public void setAvailabilityStatus(String availabilityStatus) { 
        this.availabilityStatus = availabilityStatus != null ? availabilityStatus : "ONLINE";
        updateLastModified();
    }

    // Performance metrics
    public Double getMonthlyPerformanceScore() { return monthlyPerformanceScore != null ? monthlyPerformanceScore : 0.0; }
    public void setMonthlyPerformanceScore(Double monthlyPerformanceScore) { 
        this.monthlyPerformanceScore = monthlyPerformanceScore != null ? monthlyPerformanceScore : 0.0;
        updateLastModified();
    }

    public Integer getTasksCompleted() { return tasksCompleted != null ? tasksCompleted : 0; }
    public void setTasksCompleted(Integer tasksCompleted) { 
        this.tasksCompleted = tasksCompleted != null ? tasksCompleted : 0;
        updatePerformanceMetrics();
    }

    public Integer getTasksAssigned() { return tasksAssigned != null ? tasksAssigned : 0; }
    public void setTasksAssigned(Integer tasksAssigned) { 
        this.tasksAssigned = tasksAssigned != null ? tasksAssigned : 0;
        updatePerformanceMetrics();
    }

    public Double getAverageResponseTime() { return averageResponseTime != null ? averageResponseTime : 0.0; }
    public void setAverageResponseTime(Double averageResponseTime) { 
        this.averageResponseTime = averageResponseTime != null ? averageResponseTime : 0.0;
        updateLastModified();
    }

    public Double getCustomerSatisfactionRating() { return customerSatisfactionRating != null ? customerSatisfactionRating : 0.0; }
    public void setCustomerSatisfactionRating(Double customerSatisfactionRating) { 
        this.customerSatisfactionRating = customerSatisfactionRating != null ? customerSatisfactionRating : 0.0;
        updateLastModified();
    }

    // Training and certifications
    public List<String> getCertifications() { 
        return certifications != null ? certifications : new ArrayList<>(); 
    }
    public void setCertifications(List<String> certifications) { 
        this.certifications = certifications != null ? certifications : new ArrayList<>();
        updateLastModified();
    }

    public List<String> getTrainingCompleted() { 
        return trainingCompleted != null ? trainingCompleted : new ArrayList<>(); 
    }
    public void setTrainingCompleted(List<String> trainingCompleted) { 
        this.trainingCompleted = trainingCompleted != null ? trainingCompleted : new ArrayList<>();
        updateLastModified();
    }

    public LocalDateTime getLastTrainingDate() { return lastTrainingDate; }
    public void setLastTrainingDate(LocalDateTime lastTrainingDate) { 
        this.lastTrainingDate = lastTrainingDate;
        updateLastModified();
    }

    public String getTrainingStatus() { return trainingStatus != null ? trainingStatus : "UP_TO_DATE"; }
    public void setTrainingStatus(String trainingStatus) { 
        this.trainingStatus = trainingStatus != null ? trainingStatus : "UP_TO_DATE";
        updateLastModified();
    }

    // System access logs
    public Map<String, LocalDateTime> getModuleLastAccessed() { 
        return moduleLastAccessed != null ? moduleLastAccessed : new HashMap<>(); 
    }
    public void setModuleLastAccessed(Map<String,
