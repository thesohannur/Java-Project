package com.lab.BackEnd.dto.request;

import jakarta.validation.constraints.*;
import java.util.List;
import java.util.ArrayList;

public class NGORegistrationRequest {
    // Basic Authentication Fields
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 50, message = "Password must be between 6-50 characters")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$", 
             message = "Password must contain at least one lowercase letter, one uppercase letter, and one digit")
    private String password;

    // Core Organization Details
    @NotBlank(message = "Registration number is required")
    @Size(max = 50, message = "Registration number cannot exceed 50 characters")
    private String registrationNumber;

    @NotBlank(message = "Organization name is required")
    @Size(max = 200, message = "Organization name cannot exceed 200 characters")
    private String organizationName;

    @NotBlank(message = "Contact person is required")
    @Size(max = 100, message = "Contact person name cannot exceed 100 characters")
    private String contactPerson;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^(\\+88)?01[3-9]\\d{8}$", message = "Invalid Bangladeshi phone number format")
    private String phoneNumber;

    @NotBlank(message = "Address is required")
    @Size(max = 500, message = "Address cannot exceed 500 characters")
    private String address;

    @Pattern(regexp = "^(https?://)?(www\\.)?[a-zA-Z0-9-]+(\\.[a-zA-Z]{2,})+(/.*)?$", 
             message = "Invalid website URL format")
    private String website;

    @NotBlank(message = "Description is required")
    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    private String description;

    @NotEmpty(message = "At least one focus area is required")
    @Size(max = 10, message = "Cannot have more than 10 focus areas")
    private List<String> focusAreas = new ArrayList<>();

    // Extended Contact Information
    @Email(message = "Invalid alternate email format")
    private String alternateEmail;

    @Pattern(regexp = "^(\\+88)?01[3-9]\\d{8}$", message = "Invalid alternate phone number format")
    private String alternatePhone;

    // Detailed Address Information
    @NotBlank(message = "Country is required")
    @Size(max = 50, message = "Country name cannot exceed 50 characters")
    private String country = "Bangladesh";

    @NotBlank(message = "State/Division is required")
    @Size(max = 50, message = "State name cannot exceed 50 characters")
    private String state;

    @NotBlank(message = "City is required")
    @Size(max = 50, message = "City name cannot exceed 50 characters")
    private String city;

    @Pattern(regexp = "^\\d{4,6}$", message = "Zip code must be 4-6 digits")
    private String zipCode;

    // Financial Information
    @Size(max = 30, message = "Bank account number cannot exceed 30 characters")
    private String bankAccountNumber;

    @Size(max = 100, message = "Bank name cannot exceed 100 characters")
    private String bankName;

    @Size(max = 20, message = "Tax ID cannot exceed 20 characters")
    private String taxId;

    // Social Media Links - More flexible patterns
    @Pattern(regexp = "^(https?://)?(www\\.)?(facebook\\.com|fb\\.com)/.+", 
             message = "Invalid Facebook URL format", 
             flags = Pattern.Flag.CASE_INSENSITIVE)
    private String facebookUrl;

    @Pattern(regexp = "^(https?://)?(www\\.)?(twitter\\.com|x\\.com)/.+", 
             message = "Invalid Twitter/X URL format", 
             flags = Pattern.Flag.CASE_INSENSITIVE)
    private String twitterUrl;

    @Pattern(regexp = "^(https?://)?(www\\.)?linkedin\\.com/.+", 
             message = "Invalid LinkedIn URL format", 
             flags = Pattern.Flag.CASE_INSENSITIVE)
    private String linkedinUrl;

    @Pattern(regexp = "^(https?://)?(www\\.)?instagram\\.com/.+", 
             message = "Invalid Instagram URL format", 
             flags = Pattern.Flag.CASE_INSENSITIVE)
    private String instagramUrl;

    // Dashboard Goals and Targets
    @DecimalMin(value = "0.0", inclusive = false, message = "Monthly goal must be greater than 0")
    @DecimalMax(value = "10000000.0", message = "Monthly goal cannot exceed 10,000,000")
    private Double monthlyGoal;

    @Min(value = 1, message = "Target beneficiaries must be at least 1")
    @Max(value = 1000000, message = "Target beneficiaries cannot exceed 1,000,000")
    private Integer targetBeneficiaries;

    // Certifications and Documents
    @Size(max = 20, message = "Cannot have more than 20 certifications")
    private List<String> certifications = new ArrayList<>();

    @Size(max = 10, message = "Cannot have more than 10 verification documents")
    private List<String> verificationDocuments = new ArrayList<>();

    // User Preferences
    private Boolean emailNotifications = true;
    private Boolean smsNotifications = false;

    @Pattern(regexp = "^(en|bn)$", message = "Supported languages: en (English), bn (Bengali)")
    private String preferredLanguage = "en";

    @Pattern(regexp = "^(Asia/Dhaka|UTC)$", message = "Supported timezones: Asia/Dhaka, UTC")
    private String timezone = "Asia/Dhaka";

    // Organization Type and Category
    @Pattern(regexp = "^(NGO|CHARITY|FOUNDATION|TRUST|SOCIETY|COMPANY)$", 
             message = "Organization type must be one of: NGO, CHARITY, FOUNDATION, TRUST, SOCIETY, COMPANY")
    private String organizationType = "NGO";

    @Size(max = 50, message = "Primary category cannot exceed 50 characters")
    private String primaryCategory;

    // Logo and Media
    @Pattern(regexp = "^(https?://).*\\.(jpg|jpeg|png|gif|webp)$", 
             message = "Logo URL must be a valid image URL", 
             flags = Pattern.Flag.CASE_INSENSITIVE)
    private String logoUrl;

    @Size(max = 10, message = "Cannot have more than 10 organization images")
    private List<String> organizationImages = new ArrayList<>();

    // Additional Information
    @Min(value = 1900, message = "Establishment year must be after 1900")
    @Max(value = 2024, message = "Establishment year cannot be in the future")
    private Integer establishmentYear;

    @Size(max = 2000, message = "Mission statement cannot exceed 2000 characters")
    private String missionStatement;

    @Size(max = 2000, message = "Vision statement cannot exceed 2000 characters")
    private String visionStatement;

    // Team Information
    @Min(value = 1, message = "Team size must be at least 1")
    @Max(value = 10000, message = "Team size cannot exceed 10,000")
    private Integer teamSize;

    @Min(value = 0, message = "Volunteer count cannot be negative")
    @Max(value = 100000, message = "Volunteer count cannot exceed 100,000")
    private Integer volunteerCount;

    // Constructors
    public NGORegistrationRequest() {
        this.focusAreas = new ArrayList<>();
        this.certifications = new ArrayList<>();
        this.verificationDocuments = new ArrayList<>();
        this.organizationImages = new ArrayList<>();
    }

    // Validation helper methods
    public boolean hasRequiredFields() {
        return email != null && !email.trim().isEmpty() &&
               password != null && password.length() >= 6 &&
               organizationName != null && !organizationName.trim().isEmpty() &&
               registrationNumber != null && !registrationNumber.trim().isEmpty() &&
               contactPerson != null && !contactPerson.trim().isEmpty() &&
               phoneNumber != null && !phoneNumber.trim().isEmpty() &&
               address != null && !address.trim().isEmpty() &&
               description != null && !description.trim().isEmpty() &&
               focusAreas != null && !focusAreas.isEmpty() &&
               country != null && !country.trim().isEmpty() &&
               state != null && !state.trim().isEmpty() &&
               city != null && !city.trim().isEmpty();
    }

    public void sanitizeInputs() {
        if (email != null) email = email.trim().toLowerCase();
        if (alternateEmail != null) alternateEmail = alternateEmail.trim().toLowerCase();
        if (organizationName != null) organizationName = organizationName.trim();
        if (contactPerson != null) contactPerson = contactPerson.trim();
        if (country != null) country = country.trim();
        if (state != null) state = state.trim();
        if (city != null) city = city.trim();
        if (organizationType != null) organizationType = organizationType.toUpperCase();
    }

    // Existing Getters and Setters
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRegistrationNumber() { return registrationNumber; }
    public void setRegistrationNumber(String registrationNumber) { this.registrationNumber = registrationNumber; }

    public String getOrganizationName() { return organizationName; }
    public void setOrganizationName(String organizationName) { this.organizationName = organizationName; }

    public String getContactPerson() { return contactPerson; }
    public void setContactPerson(String contactPerson) { this.contactPerson = contactPerson; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public List<String> getFocusAreas() { return focusAreas; }
    public void setFocusAreas(List<String> focusAreas) { 
        this.focusAreas = focusAreas != null ? focusAreas : new ArrayList<>(); 
    }

    // New Getters and Setters for Dashboard Support
    public String getAlternateEmail() { return alternateEmail; }
    public void setAlternateEmail(String alternateEmail) { this.alternateEmail = alternateEmail; }

    public String getAlternatePhone() { return alternatePhone; }
    public void setAlternatePhone(String alternatePhone) { this.alternatePhone = alternatePhone; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getZipCode() { return zipCode; }
    public void setZipCode(String zipCode) { this.zipCode = zipCode; }

    public String getBankAccountNumber() { return bankAccountNumber; }
    public void setBankAccountNumber(String bankAccountNumber) { this.bankAccountNumber = bankAccountNumber; }

    public String getBankName() { return bankName; }
    public void setBankName(String bankName) { this.bankName = bankName; }

    public String getTaxId() { return taxId; }
    public void setTaxId(String taxId) { this.taxId = taxId; }

    public String getFacebookUrl() { return facebookUrl; }
    public void setFacebookUrl(String facebookUrl) { this.facebookUrl = facebookUrl; }

    public String getTwitterUrl() { return twitterUrl; }
    public void setTwitterUrl(String twitterUrl) { this.twitterUrl = twitterUrl; }

    public String getLinkedinUrl() { return linkedinUrl; }
    public void setLinkedinUrl(String linkedinUrl) { this.linkedinUrl = linkedinUrl; }

    public String getInstagramUrl() { return instagramUrl; }
    public void setInstagramUrl(String instagramUrl) { this.instagramUrl = instagramUrl; }

    public Double getMonthlyGoal() { return monthlyGoal; }
    public void setMonthlyGoal(Double monthlyGoal) { this.monthlyGoal = monthlyGoal; }

    public Integer getTargetBeneficiaries() { return targetBeneficiaries; }
    public void setTargetBeneficiaries(Integer targetBeneficiaries) { this.targetBeneficiaries = targetBeneficiaries; }

    public List<String> getCertifications() { return certifications; }
    public void setCertifications(List<String> certifications) { 
        this.certifications = certifications != null ? certifications : new ArrayList<>(); 
    }

    public List<String> getVerificationDocuments() { return verificationDocuments; }
    public void setVerificationDocuments(List<String> verificationDocuments) { 
        this.verificationDocuments = verificationDocuments != null ? verificationDocuments : new ArrayList<>(); 
    }

    public Boolean getEmailNotifications() { return emailNotifications; }
    public void setEmailNotifications(Boolean emailNotifications) { 
        this.emailNotifications = emailNotifications != null ? emailNotifications : true; 
    }

    public Boolean getSmsNotifications() { return smsNotifications; }
    public void setSmsNotifications(Boolean smsNotifications) { 
        this.smsNotifications = smsNotifications != null ? smsNotifications : false; 
    }

    public String getPreferredLanguage() { return preferredLanguage; }
    public void setPreferredLanguage(String preferredLanguage) { this.preferredLanguage = preferredLanguage; }

    public String getTimezone() { return timezone; }
    public void setTimezone(String timezone) { this.timezone = timezone; }

    public String getOrganizationType() { return organizationType; }
    public void setOrganizationType(String organizationType) { this.organizationType = organizationType; }

    public String getPrimaryCategory() { return primaryCategory; }
    public void setPrimaryCategory(String primaryCategory) { this.primaryCategory = primaryCategory; }

    public String getLogoUrl() { return logoUrl; }
    public void setLogoUrl(String logoUrl) { this.logoUrl = logoUrl; }

    public List<String> getOrganizationImages() { return organizationImages; }
    public void setOrganizationImages(List<String> organizationImages) { 
        this.organizationImages = organizationImages != null ? organizationImages : new ArrayList<>(); 
    }

    public Integer getEstablishmentYear() { return establishmentYear; }
    public void setEstablishmentYear(Integer establishmentYear) { this.establishmentYear = establishmentYear; }

    public String getMissionStatement() { return missionStatement; }
    public void setMissionStatement(String missionStatement) { this.missionStatement = missionStatement; }

    public String getVisionStatement() { return visionStatement; }
    public void setVisionStatement(String visionStatement) { this.visionStatement = visionStatement; }

    public Integer getTeamSize() { return teamSize; }
    public void setTeamSize(Integer teamSize) { this.teamSize = teamSize; }

    public Integer getVolunteerCount() { return volunteerCount; }
    public void setVolunteerCount(Integer volunteerCount) { this.volunteerCount = volunteerCount; }

    // Convenience methods for boolean fields
    public boolean isEmailNotifications() { return Boolean.TRUE.equals(emailNotifications); }
    public boolean isSmsNotifications() { return Boolean.TRUE.equals(smsNotifications); }

    @Override
    public String toString() {
        return "NGORegistrationRequest{" +
                "email='" + email + '\'' +
                ", organizationName='" + organizationName + '\'' +
                ", registrationNumber='" + registrationNumber + '\'' +
                ", contactPerson='" + contactPerson + '\'' +
                ", country='" + country + '\'' +
                ", state='" + state + '\'' +
                ", city='" + city + '\'' +
                ", organizationType='" + organizationType + '\'' +
                '}';
    }
}
