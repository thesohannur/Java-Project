package com.lab.BackEnd.dto.request;

import jakarta.validation.constraints.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public class LoginRequest {
    // Basic Authentication Fields
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 50, message = "Password must be between 6-50 characters")
    private String password;

    // Enhanced User Type Support
    @Pattern(regexp = "^(NGO|DONOR|ADMIN|VOLUNTEER|BENEFICIARY|MODERATOR|SUPER_ADMIN)$", 
             message = "User type must be one of: NGO, DONOR, ADMIN, VOLUNTEER, BENEFICIARY, MODERATOR, SUPER_ADMIN")
    private String userType = "DONOR"; // Default to DONOR for general users

    // Role-specific Sub-types
    @Pattern(regexp = "^(INDIVIDUAL|CORPORATE|FOUNDATION|GOVERNMENT|ANONYMOUS)?$", 
             message = "Donor type must be one of: INDIVIDUAL, CORPORATE, FOUNDATION, GOVERNMENT, ANONYMOUS")
    private String donorType; // For DONOR role

    @Pattern(regexp = "^(CHARITY|FOUNDATION|TRUST|SOCIETY|COMPANY|INTERNATIONAL)?$", 
             message = "NGO type must be one of: CHARITY, FOUNDATION, TRUST, SOCIETY, COMPANY, INTERNATIONAL")
    private String ngoType; // For NGO role

    @Pattern(regexp = "^(SUPER_ADMIN|ADMIN|MODERATOR|SUPPORT|FINANCE|TECHNICAL)?$", 
             message = "Admin level must be one of: SUPER_ADMIN, ADMIN, MODERATOR, SUPPORT, FINANCE, TECHNICAL")
    private String adminLevel; // For ADMIN role

    // Device and Session Information
    private String deviceInfo;
    private String ipAddress;
    private String userAgent;
    private String sessionId;
    private Boolean rememberMe = false;
    private Integer sessionDuration = 24; // Hours

    // Security Features
    private Boolean twoFactorRequired = false;
    private String twoFactorCode;
    private String captchaToken;
    private Boolean acceptTerms = false;

    // Location and Preferences
    private String country = "Bangladesh";
    private String preferredLanguage = "en";
    private String timezone = "Asia/Dhaka";

    // Login Context
    private String loginSource = "WEB"; // WEB, MOBILE, API
    private String referrer;
    private Map<String, String> additionalParams;

    // Audit and Tracking
    private LocalDateTime loginAttemptTime;
    private String clientVersion;
    private Boolean isFirstLogin = false;

    // Constructors
    public LoginRequest() {
        this.loginAttemptTime = LocalDateTime.now();
    }

    public LoginRequest(String email, String password) {
        this();
        this.email = email;
        this.password = password;
    }

    public LoginRequest(String email, String password, String userType) {
        this();
        this.email = email;
        this.password = password;
        this.userType = userType;
    }

    public LoginRequest(String email, String password, String userType, String subType) {
        this();
        this.email = email;
        this.password = password;
        this.userType = userType;
        setSubType(subType);
    }

    // Enhanced Utility Methods
    public boolean isNGO() {
        return "NGO".equalsIgnoreCase(this.userType);
    }

    public boolean isDonor() {
        return "DONOR".equalsIgnoreCase(this.userType);
    }

    public boolean isAdmin() {
        return "ADMIN".equalsIgnoreCase(this.userType) || 
               "SUPER_ADMIN".equalsIgnoreCase(this.userType) || 
               "MODERATOR".equalsIgnoreCase(this.userType);
    }

    public boolean isVolunteer() {
        return "VOLUNTEER".equalsIgnoreCase(this.userType);
    }

    public boolean isBeneficiary() {
        return "BENEFICIARY".equalsIgnoreCase(this.userType);
    }

    public boolean isSuperAdmin() {
        return "SUPER_ADMIN".equalsIgnoreCase(this.userType) || 
               "SUPER_ADMIN".equalsIgnoreCase(this.adminLevel);
    }

    public boolean isCorporateDonor() {
        return isDonor() && "CORPORATE".equalsIgnoreCase(this.donorType);
    }

    public boolean isIndividualDonor() {
        return isDonor() && ("INDIVIDUAL".equalsIgnoreCase(this.donorType) || this.donorType == null);
    }

    public boolean isInternationalNGO() {
        return isNGO() && "INTERNATIONAL".equalsIgnoreCase(this.ngoType);
    }

    public boolean requiresTwoFactor() {
        return Boolean.TRUE.equals(this.twoFactorRequired) || isSuperAdmin();
    }

    public boolean isMobileLogin() {
        return "MOBILE".equalsIgnoreCase(this.loginSource);
    }

    // Role-based validation
    public boolean isValidForRole() {
        switch (userType != null ? userType.toUpperCase() : "DONOR") {
            case "NGO":
                return ngoType == null || isValidNGOType();
            case "DONOR":
                return donorType == null || isValidDonorType();
            case "ADMIN":
            case "SUPER_ADMIN":
            case "MODERATOR":
                return adminLevel == null || isValidAdminLevel();
            case "VOLUNTEER":
            case "BENEFICIARY":
                return true;
            default:
                return false;
        }
    }

    private boolean isValidNGOType() {
        return ngoType != null && List.of("CHARITY", "FOUNDATION", "TRUST", "SOCIETY", "COMPANY", "INTERNATIONAL")
                .contains(ngoType.toUpperCase());
    }

    private boolean isValidDonorType() {
        return donorType != null && List.of("INDIVIDUAL", "CORPORATE", "FOUNDATION", "GOVERNMENT", "ANONYMOUS")
                .contains(donorType.toUpperCase());
    }

    private boolean isValidAdminLevel() {
        return adminLevel != null && List.of("SUPER_ADMIN", "ADMIN", "MODERATOR", "SUPPORT", "FINANCE", "TECHNICAL")
                .contains(adminLevel.toUpperCase());
    }

    // Helper method to set sub-type based on user type
    public void setSubType(String subType) {
        if (subType == null) return;
        
        switch (userType != null ? userType.toUpperCase() : "DONOR") {
            case "NGO":
                this.ngoType = subType.toUpperCase();
                break;
            case "DONOR":
                this.donorType = subType.toUpperCase();
                break;
            case "ADMIN":
            case "SUPER_ADMIN":
            case "MODERATOR":
                this.adminLevel = subType.toUpperCase();
                break;
        }
    }

    public String getSubType() {
        if (isNGO()) return ngoType;
        if (isDonor()) return donorType;
        if (isAdmin()) return adminLevel;
        return null;
    }

    // Input sanitization
    public void sanitizeInputs() {
        if (email != null) email = email.trim().toLowerCase();
        if (userType != null) userType = userType.toUpperCase();
        if (donorType != null) donorType = donorType.toUpperCase();
        if (ngoType != null) ngoType = ngoType.toUpperCase();
        if (adminLevel != null) adminLevel = adminLevel.toUpperCase();
        if (country != null) country = country.trim();
        if (preferredLanguage != null) preferredLanguage = preferredLanguage.toLowerCase();
    }

    // Getters and Setters
    public String getEmail() { 
        return email; 
    }
    
    public void setEmail(String email) { 
        this.email = email; 
    }

    public String getPassword() { 
        return password; 
    }
    
    public void setPassword(String password) { 
        this.password = password; 
    }

    public String getUserType() { 
        return userType; 
    }
    
    public void setUserType(String userType) { 
        this.userType = userType != null ? userType.toUpperCase() : "DONOR"; 
    }

    public String getDonorType() { 
        return donorType; 
    }
    
    public void setDonorType(String donorType) { 
        this.donorType = donorType != null ? donorType.toUpperCase() : null; 
    }

    public String getNgoType() { 
        return ngoType; 
    }
    
    public void setNgoType(String ngoType) { 
        this.ngoType = ngoType != null ? ngoType.toUpperCase() : null; 
    }

    public String getAdminLevel() { 
        return adminLevel; 
    }
    
    public void setAdminLevel(String adminLevel) { 
        this.adminLevel = adminLevel != null ? adminLevel.toUpperCase() : null; 
    }

    public String getDeviceInfo() { 
        return deviceInfo; 
    }
    
    public void setDeviceInfo(String deviceInfo) { 
        this.deviceInfo = deviceInfo; 
    }

    public String getIpAddress() { 
        return ipAddress; 
    }
    
    public void setIpAddress(String ipAddress) { 
        this.ipAddress = ipAddress; 
    }

    public String getUserAgent() { 
        return userAgent; 
    }
    
    public void setUserAgent(String userAgent) { 
        this.userAgent = userAgent; 
    }

    public String getSessionId() { 
        return sessionId; 
    }
    
    public void setSessionId(String sessionId) { 
        this.sessionId = sessionId; 
    }

    public Boolean getRememberMe() { 
        return rememberMe; 
    }
    
    public void setRememberMe(Boolean rememberMe) { 
        this.rememberMe = rememberMe != null ? rememberMe : false; 
    }

    public Integer getSessionDuration() { 
        return sessionDuration; 
    }
    
    public void setSessionDuration(Integer sessionDuration) { 
        this.sessionDuration = sessionDuration != null ? sessionDuration : 24; 
    }

    public Boolean getTwoFactorRequired() { 
        return twoFactorRequired; 
    }
    
    public void setTwoFactorRequired(Boolean twoFactorRequired) { 
        this.twoFactorRequired = twoFactorRequired != null ? twoFactorRequired : false; 
    }

    public String getTwoFactorCode() { 
        return twoFactorCode; 
    }
    
    public void setTwoFactorCode(String twoFactorCode) { 
        this.twoFactorCode = twoFactorCode; 
    }

    public String getCaptchaToken() { 
        return captchaToken; 
    }
    
    public void setCaptchaToken(String captchaToken) { 
        this.captchaToken = captchaToken; 
    }

    public Boolean getAcceptTerms() { 
        return acceptTerms; 
    }
    
    public void setAcceptTerms(Boolean acceptTerms) { 
        this.acceptTerms = acceptTerms != null ? acceptTerms : false; 
    }

    public String getCountry() { 
        return country; 
    }
    
    public void setCountry(String country) { 
        this.country = country != null ? country : "Bangladesh"; 
    }

    public String getPreferredLanguage() { 
        return preferredLanguage; 
    }
    
    public void setPreferredLanguage(String preferredLanguage) { 
        this.preferredLanguage = preferredLanguage != null ? preferredLanguage : "en"; 
    }

    public String getTimezone() { 
        return timezone; 
    }
    
    public void setTimezone(String timezone) { 
        this.timezone = timezone != null ? timezone : "Asia/Dhaka"; 
    }

    public String getLoginSource() { 
        return loginSource; 
    }
    
    public void setLoginSource(String loginSource) { 
        this.loginSource = loginSource != null ? loginSource.toUpperCase() : "WEB"; 
    }

    public String getReferrer() { 
        return referrer; 
    }
    
    public void setReferrer(String referrer) { 
        this.referrer = referrer; 
    }

    public Map<String, String> getAdditionalParams() { 
        return additionalParams; 
    }
    
    public void setAdditionalParams(Map<String, String> additionalParams) { 
        this.additionalParams = additionalParams; 
    }

    public LocalDateTime getLoginAttemptTime() { 
        return loginAttemptTime; 
    }
    
    public void setLoginAttemptTime(LocalDateTime loginAttemptTime) { 
        this.loginAttemptTime = loginAttemptTime; 
    }

    public String getClientVersion() { 
        return clientVersion; 
    }
    
    public void setClientVersion(String clientVersion) { 
        this.clientVersion = clientVersion; 
    }

    public Boolean getIsFirstLogin() { 
        return isFirstLogin; 
    }
    
    public void setIsFirstLogin(Boolean isFirstLogin) { 
        this.isFirstLogin = isFirstLogin != null ? isFirstLogin : false; 
    }

    // Convenience methods for boolean fields
    public boolean isRememberMe() { return Boolean.TRUE.equals(rememberMe); }
    public boolean isTwoFactorRequired() { return Boolean.TRUE.equals(twoFactorRequired); }
    public boolean isAcceptTerms() { return Boolean.TRUE.equals(acceptTerms); }
    public boolean isFirstLogin() { return Boolean.TRUE.equals(isFirstLogin); }

    // Enhanced validation method
    @Override
    public boolean isValid() {
        return email != null && !email.trim().isEmpty() &&
               password != null && password.length() >= 6 &&
               userType != null && isValidUserType() &&
               isValidForRole() &&
               (twoFactorCode != null || !requiresTwoFactor());
    }

    private boolean isValidUserType() {
        return userType != null && List.of("NGO", "DONOR", "ADMIN", "VOLUNTEER", "BENEFICIARY", "MODERATOR", "SUPER_ADMIN")
                .contains(userType.toUpperCase());
    }

    // Enhanced toString method (exclude sensitive information)
    @Override
    public String toString() {
        return "LoginRequest{" +
                "email='" + email + '\'' +
                ", userType='" + userType + '\'' +
                ", subType='" + getSubType() + '\'' +
                ", deviceInfo='" + deviceInfo + '\'' +
                ", ipAddress='" + ipAddress + '\'' +
                ", loginSource='" + loginSource + '\'' +
                ", country='" + country + '\'' +
                ", preferredLanguage='" + preferredLanguage + '\'' +
                ", rememberMe=" + rememberMe +
                ", twoFactorRequired=" + twoFactorRequired +
                ", loginAttemptTime=" + loginAttemptTime +
                '}';
    }

    // Create role-specific login requests
    public static LoginRequest forNGO(String email, String password, String ngoType) {
        LoginRequest request = new LoginRequest(email, password, "NGO");
        request.setNgoType(ngoType);
        return request;
    }

    public static LoginRequest forDonor(String email, String password, String donorType) {
        LoginRequest request = new LoginRequest(email, password, "DONOR");
        request.setDonorType(donorType);
        return request;
    }

    public static LoginRequest forAdmin(String email, String password, String adminLevel) {
        LoginRequest request = new LoginRequest(email, password, "ADMIN");
        request.setAdminLevel(adminLevel);
        request.setTwoFactorRequired(true);
        return request;
    }

    public static LoginRequest forVolunteer(String email, String password) {
        return new LoginRequest(email, password, "VOLUNTEER");
    }

    public static LoginRequest forBeneficiary(String email, String password) {
        return new LoginRequest(email, password, "BENEFICIARY");
    }
}
