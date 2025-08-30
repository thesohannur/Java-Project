// dto/response/VolunteerResponse.java
package com.lab.BackEnd.dto.response;

import com.lab.BackEnd.model.enums.VolunteerStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class VolunteerResponse {
    private String volunteerId;
    private VolunteerStatus status;
    private Integer hoursCommitted;
    private Integer hoursCompleted;
    private LocalDateTime applicationDate;
    private LocalDateTime completedDate;
}
