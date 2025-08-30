// dto/request/VolunteerRequest.java
package com.lab.BackEnd.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VolunteerRequest {
    @NotBlank(message = "Opportunity ID required")
    private String opportunityId;

    @Size(max = 500, message = "Message too long")
    private String message;

    @Min(value = 1, message = "Hours must be ≥1")
    private Integer hoursCommitted;

}
