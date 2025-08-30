// model/VolunteerOpportunity.java
package com.lab.BackEnd.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Document("volunteer_opportunities")
public class VolunteerOpportunity {
    @Id private String opportunityId;

    private String ngoId;
    private String title;
    private String description;
    private String location;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Integer maxVolunteers = 1;
    private Integer currentVolunteers = 0;
    private List<String> skillsRequired;

    private String linkedCampaignId;     // null ⇒ standing request
    private boolean active = true;
    private LocalDateTime createdAt = LocalDateTime.now();
}
