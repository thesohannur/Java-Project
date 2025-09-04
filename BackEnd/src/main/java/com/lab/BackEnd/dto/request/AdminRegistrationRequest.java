package com.lab.BackEnd.dto.request;

import jakarta.validation.constraints.*;
import java.util.List;

public class AdminRegistrationRequest {
    // Basic Authentication Fields
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, max = 50, message = "Password must be between 8-50 characters")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$", 
             message = "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character")
    private String password;

    @NotBlank(message = "Confirm password is required")
    private String confirmPassword;

    @NotBlank(message = "Full name is required")
    @Size(min = 2, max = 100, message = "Full name must be between 2-100 characters")
    @Pattern(regexp = "^[a-zA-Z\\s.'-]+$", message = "Full name can only contain letters, spaces, dots, apostrophes, and hyphens")
    private String fullName;

    @NotBlank(message = "Admin key is required")
    @Size(min = 10, max = 50, message = "Admin key must be between 10-50 characters")
    private String adminKey;

    // Admin Level and Department
    @Pattern(regexp = "^(SUPER_ADMIN|ADMIN|MODERATOR|SUPPORT)$", 
             message = "Admin level must be one of: SUPER_ADMIN, ADMIN, MODERATOR, SUPPORT")
    private String adminLevel = "MODERATOR";

    @Pattern(regexp = "^(GENERAL|NGO_VERIFICATION|DONOR_SUPPORT|FINANCE|TECHNICAL|CONTENT_MODERATION)$", 
             message = "Department must be one of: GENERAL, NGO_VERIFICATION, DONOR_SUPPORT, FINANCE, TECHNICAL, CONTENT_MODERATION")
    private String department = "GENERAL";

    // Contact Information
    @Pattern(regexp = "^(\\+88)?01[3-9]\\d{8}$", message = "Invalid Bangladeshi phone number format")
    private String phoneNumber;

    @Email(message = "Invalid alternate email format")
    private String alternateEmail;

    @Size(max = 200, message = "Address cannot exceed 200 characters")
    private String address;

    // Location Information
    @NotBlank(message = "Country is required")
    @Size(max = 50, message = "Country name cannot exceed 50 characters")
    private String country = "Bangladesh";

    @Size(max = 50, message = "State name cannot exceed 50 characters")
    private String state;

    @Size(max = 50, message = "City name cannot exceed 50 characters")
    private String city;

    // Work Information
    @Size(max = 20, message = "Employee ID cannot exceed 20 characters")
    private String employeeId;

    @Size(max = 100, message = "Designation cannot exceed 100 characters")
    private String designation;

    @Pattern(regexp = "^(HEAD_OFFICE|REMOTE|FIELD_OFFICE)$", 
             message = "Work location must be one of: HEAD_OFFICE, REMOTE, FIELD_OFFICE")
    private String workLocation = "HEAD_OFFICE";

    @Pattern(regexp = "^(DAY|NIGHT|FLEXIBLE)$", 
             message = "Work shift must be one of: DAY, NIGHT, FLEXIBLE")
    private String workShift = "DAY";

    // Emergency Contact
    @Size(max = 100, message = "Emergency contact name cannot exceed 100 characters")
    private String emergencyContact;

    @Pattern(regexp = "^(\\+88)?01[3-9]\\d{8}$", message = "Invalid emergency contact phone number format")
    private String emergencyContactPhone;

    // Permissions and Access
    private List<String> requestedPermissions;
    private List<String> requestedModules;

    // Supervisor Information
    private String supervisorId;
    private String reportingManager;

    // Settings and Preferences
    @Pattern(regexp = "^(en|bn)$", message = "Supported languages: en (English), bn (Bengali)")
    private String preferredLanguage = "en";

    @Pattern(regexp = "^(Asia/Dhaka|UTC)$", message = "Supported timezones: Asia/Dhaka, UTC")
    private String timezone = "Asia/Dhaka";

    @Pattern(regexp = "^(LIGHT|DARK|AUTO)$", message = "Theme must be one of: LIGHT, DARK, AUTO")
    private String theme = "LIGHT";

    // Notification Preferences
    private Boolean emailNotifications = true;
    private Boolean systemAlerts = true;
    private Boolean reportNotifications = true;

    // Security Settings
    private Boolean twoFactorEnabled = false;
    private Boolean forcePasswordChange = true;

    // Training and Certifications
    private List<String> certifications;
    private List<String> completedTraining;

    // Additional Information
    @Size(max = 500, message = "Additional notes cannot exceed 500 characters")
    private String additionalNotes;

    @Size(max = 1000, message = "Admin description cannot exceed 1000 characters")
    private String adminDescription;

    // Profile Information
    private String profileImageUrl;

    // Constructors
    public AdminRegistrationRequest() {}

    public AdminRegistrationRequest(String email, String password, String fullName, String adminKey) {
        this.email = email;
        this.password = password;
        this.fullName = fullName;
        this.adminKey = adminKey;
    }

    // Validation helper methods
    public boolean isPasswordMatching() {
        return password != null && password.equals(confirmPassword);
    }

    public boolean hasRequiredFields() {
        return email != null && !email.trim().isEmpty() &&
               password != null && !password.trim().isEmpty() &&
               fullName != null && !fullName.trim().isEmpty() &&
               adminKey != null && !adminKey.trim().isEmpty() &&
               country != null && !country.trim().isEmpty();
    }

    public boolean isValidAdminLevel() {
        return adminLevel != null && 
               (adminLevel.equals("SUPER_ADMIN") || adminLevel.equals("ADMIN") || 
                adminLevel.equals("MODERATOR") || adminLevel.equals("SUPPORT"));
    }

    public void sanitizeInputs() {
        if (email != null) email = email.trim().toLowerCase();
        if (alternateEmail != null) alternateEmail = alternateEmail.trim().toLowerCase();
        if (fullName != null) fullName = fullName.trim();
        if (country != null) country = country.trim();
        if (state != null) state = state.trim();
        if (city != null) city = city.trim();
        if (adminLevel != null) adminLevel = adminLevel.toUpperCase();
        if (department != null) department = department.toUpperCase();
    }

    // Getters and Setters
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getConfirmPassword() { return confirmPassword; }
    public void setConfirmPassword(String confirmPassword) { this.confirmPassword = confirmPassword; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getAdminKey() { return adminKey; }
    public void setAdminKey(String adminKey) { this.adminKey = adminKey; }

    public String getAdminLevel() { return adminLevel; }
    public void setAdminLevel(String adminLevel) { this.adminLevel = adminLevel; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getAlternateEmail() { return alternateEmail; }
    public void setAlternateEmail(String alternateEmail) { this.alternateEmail = alternateEmail; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }

    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }

    public String getWorkLocation() { return workLocation; }
    public void setWorkLocation(String workLocation) { this.workLocation = workLocation; }

    public String getWorkShift() { return workShift; }
    public void setWorkShift(String workShift) { this.workShift = workShift; }

    public String getEmergencyContact() { return emergencyContact; }
    public void setEmergencyContact(String emergencyContact) { this.emergencyContact = emergencyContact; }

    public String getEmergencyContactPhone() { return emergencyContactPhone; }
    public void setEmergencyContactPhone(String emergencyContactPhone) { this.emergencyContactPhone = emergencyContactPhone; }

    public List<String> getRequestedPermissions() { return requestedPermissions; }
    public void setRequestedPermissions(List<String> requestedPermissions) { this.requestedPermissions = requestedPermissions; }

    public List<String> getRequestedModules() { return requestedModules; }
    public void setRequestedModules(List<String> requestedModules) { this.requestedModules = requestedModules; }

    public String getSupervisorId() { return supervisorId; }
    public void setSupervisorId(String supervisorId) { this.supervisorId = supervisorId; }

    public String getReportingManager() { return reportingManager; }
    public void setReportingManager(String reportingManager) { this.reportingManager = reportingManager; }

    public String getPreferredLanguage() { return preferredLanguage; }
    public void setPreferredLanguage(String preferredLanguage) { this.preferredLanguage = preferredLanguage; }

    public String getTimezone() { return timezone; }
    public void setTimezone(String timezone) { this.timezone = timezone; }

    public String getTheme() { return theme; }
    public void setTheme(String theme) { this.theme = theme; }

    public Boolean getEmailNotifications() { return emailNotifications; }
    public void setEmailNotifications(Boolean emailNotifications) { this.emailNotifications = emailNotifications; }

    public Boolean getSystemAlerts() { return systemAlerts; }
    public void setSystemAlerts(Boolean systemAlerts) { this.systemAlerts = systemAlerts; }

    public Boolean getReportNotifications() { return reportNotifications; }
    public void setReportNotifications(Boolean reportNotifications) { this.reportNotifications = reportNotifications; }

    public Boolean getTwoFactorEnabled() { return twoFactorEnabled; }
    public void setTwoFactorEnabled(Boolean twoFactorEnabled) { this.twoFactorEnabled = twoFactorEnabled; }

    public Boolean getForcePasswordChange() { return forcePasswordChange; }
    public void setForcePasswordChange(Boolean forcePasswordChange) { this.forcePasswordChange = forcePasswordChange; }

    public List<String> getCertifications() { return certifications; }
    public void setCertifications(List<String> certifications) { this.certifications = certifications; }

    public List<String> getCompletedTraining() { return completedTraining; }
    public void setCompletedTraining(List<String> completedTraining) { this.completedTraining = completedTraining; }

    public String getAdditionalNotes() { return additionalNotes; }
    public void setAdditionalNotes(String additionalNotes) { this.additionalNotes = additionalNotes; }

    public String getAdminDescription() { return adminDescription; }
    public void setAdminDescription(String adminDescription) { this.adminDescription = adminDescription; }

    public String getProfileImageUrl() { return profileImageUrl; }
    public void setProfileImageUrl(String profileImageUrl) { this.profileImageUrl = profileImageUrl; }

    // Convenience methods for boolean fields
    public boolean isEmailNotifications() { return Boolean.TRUE.equals(emailNotifications); }
    public boolean isSystemAlerts() { return Boolean.TRUE.equals(systemAlerts); }
    public boolean isReportNotifications() { return Boolean.TRUE.equals(reportNotifications); }
    public boolean isTwoFactorEnabled() { return Boolean.TRUE.equals(twoFactorEnabled); }
    public boolean isForcePasswordChange() { return Boolean.TRUE.equals(forcePasswordChange); }

    @Override
    public String toString() {
        return "AdminRegistrationRequest{" +
                "email='" + email + '\'' +
                ", fullName='" + fullName + '\'' +
                ", adminLevel='" + adminLevel + '\'' +
                ", department='" + department + '\'' +
                ", country='" + country + '\'' +
                ", state='" + state + '\'' +
                ", city='" + city + '\'' +
                ", workLocation='" + workLocation + '\'' +
                ", designation='" + designation + '\'' +
                '}';
    }
}
