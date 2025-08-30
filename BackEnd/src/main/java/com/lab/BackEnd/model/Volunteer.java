// model/Volunteer.java
package com.lab.BackEnd.model;

import com.lab.BackEnd.model.enums.VolunteerStatus;
import lombok.Getter; import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Getter
@Setter
@Document("volunteers")
public class Volunteer {
    @Id private String volunteerId;

    private String donorId;
    private String opportunityId;
    private String ngoId;

    private LocalDateTime applicationDate = LocalDateTime.now();
    private VolunteerStatus status = VolunteerStatus.PENDING;

    private String donorMessage;
    private String ngoFeedback;

    private Integer hoursCommitted;
    private Integer hoursCompleted = 0;

    private LocalDateTime completedDate;
}
