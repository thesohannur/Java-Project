package com.lab.BackEnd.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class NGORegistrationRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 20, message = "Password must be between 6-20 characters")
    private String password;

    @NotBlank(message = "Registration number is required")
    @Size(max = 20, message = "Registration number cannot exceed 20 characters")
    private String registrationNumber;

    @NotBlank(message = "Organization name is required")
    @Size(max = 100, message = "Organization name cannot exceed 100 characters")
    private String organizationName;

    @NotBlank(message = "Contact person is required")
    @Size(max = 100, message = "Contact person name cannot exceed 100 characters")
    private String contactPerson;

    @Pattern(regexp = "^(\\+88)?01[3-9]\\d{8}$", message = "Invalid phone number format")
    private String phoneNumber;

    @Size(max = 200, message = "Address cannot exceed 200 characters")
    private String address;

    private String website;

    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;

    private List<String> focusAreas;

    public NGORegistrationRequest() {}

}