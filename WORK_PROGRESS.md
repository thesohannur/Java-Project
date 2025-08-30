# Volunteer (Time Donation) System Workflow

## System Flow Overview

The volunteer system allows donors to contribute their **time and skills** instead of money. Here's how it works:

---

## Step 1: NGO Creates Volunteer Opportunity

```
NGO logs in → Creates Volunteer Opportunity → Sets volunteer details
```

### NGO Action:
- Navigate to "Create Volunteer Opportunity"
- Fill in details:
  - **Title**: "Weekend Literacy Tutor"
  - **Description**: "Teach reading skills to children"
  - **Location**: "Community Center Room 2"
  - **Hours needed**: 4 hours
  - **Max volunteers**: 10 people
  - **Date/Time**: Sept 15, 2025, 9 AM - 1 PM
  - **Skills required**: "Basic teaching skills"
  - **Linked Campaign** (optional): for disaster response

### System Response:
```java
VolunteerOpportunity created with:
├── active = true
├── currentVolunteers = 0
├── linkedCampaignId = null or campaignId
└── status = ACTIVE
```

---

## Step 2: Donor Discovers Opportunities

```
Donor logs in → Clicks "Time Donation" → Sees volunteer opportunities
```

### Donor Action:
- Login to platform
- Click **"Time Donation"** button
- Browse list of available volunteer opportunities
- See details like:
  - What work needs to be done
  - Where and when
  - How many hours
  - Skills needed

### System Response:
```java
GET /api/donor/volunteer-opportunities
Returns list of opportunities where:
├── active = true
└── currentVolunteers < maxVolunteers
```

---

## Step 3: Donor Applies for Volunteering

```
Donor selects opportunity → Writes message → Commits hours → Applies
```

### Donor Action:
- Click on desired volunteer opportunity
- Fill application form:
  - **Message**: "I have experience teaching and tutoring"
  - **Hours I can commit**: 4 hours
  - **Availability**: Confirm date/time works
- Submit application

### System Response:
```java
Volunteer application created:
├── donorId = "donor123"...
```

---

## Step 4: NGO Reviews Applications

```
NGO logs in → Views volunteer applications → Reviews donor profiles → Approves/Rejects
```

### NGO Action:
- Login and navigate to "Volunteer Applications"
- See list of pending applications with:
  - Donor name and profile
  - Message from donor
  - Hours they can commit
  - Their volunteer history
- Review and decide to **Approve** or **Reject**

### System Response:
```java
If APPROVED:
├── volunteer.status = APPROVED
├── opportunity.currentVolunteers += 1
└── Notification sent to donor

If REJECTED:
├── volunteer.status = REJECTED
└── Rejection notice sent to donor
```

---

## Step 5: Volunteer Work Happens

```
Donor shows up → Does the work → NGO confirms completion
```

### Real World Action:
- **Donor**: Shows up at location at scheduled time
- **NGO Coordinator**: Assigns specific tasks
- **Work**: Donor spends committed hours volunteering
- **NGO**: Marks work as completed in system

### System Response:
```java
Work completion:
├── volunteer.status = COMPLETED
├── volunteer.hoursCompleted = committed hours
├── volunteer.completedDate = now()
└── Donor's total volunteer hours updated
```

---

## Complete Status Flow

### Application Lifecycle:
```
CREATED → PENDING → APPROVED → IN_PROGRESS → COMPLETED
          ↓
        REJECTED
```

### Status Meanings:
- **PENDING**: Waiting for NGO review
- **APPROVED**: NGO accepted the volunteer
- **REJECTED**: NGO declined the application
- **IN_PROGRESS**: Volunteer work is happening
- **COMPLETED**: Work finished successfully

---

## Key Differences from Money Donation

| Money Donation | Time Donation |
|---------------|---------------|
| Click "Donate" → Pay → Done | Apply → Get approved → Show up → Work → Complete |
| Instant process | Multi-step process |
| No approval needed | NGO must approve |
| System handles everything | Requires human coordination |
| Unlimited donations possible | Limited by volunteer slots |

---

## Frontend User Experience

### For Donors:
```
Dashboard
├── "Money Donation" button
└── "Time Donation" button
    ├── Browse volunteer opportunities
    ├── Apply for positions
    ├── View my applications
    └── See my volunteer history
```

### For NGOs:
```
Dashboard
├── "Create Money Campaign"
└── "Create Volunteer Opportunities"
    ├── Set volunteer requirements
    ├── Review applications
    ├── Approve/reject volunteers
    └── Mark work as completed
```

---

## Database Collections

### Money Donations:
```
payments: [
  { donorId, ngoId, amount, status: "SUCCESS" }
]
```

### Time Donations:
```
volunteers: [
  { donorId, opportunityId, ngoId, hoursCommitted, hoursCompleted, status: "COMPLETED" }
]
```

### Volunteer Opportunities (Standing or Campaign-linked):
```
volunteer_opportunities: [
  { opportunityId, ngoId, title, active, linkedCampaignId=null or campaignId }
]
```

This updated workflow covers **both standing volunteer opportunities and campaign-linked volunteer calls**, providing NGOs with flexibility to engage donors any time.


---

# REST Endpoints & Example Payloads

| Method | Path | Role | Purpose |
|--------|------|------|---------|
| POST   | /api/ngo/volunteer-opportunities        | NGO   | Create standing or campaign-linked volunteer opportunity |
| PUT    | /api/ngo/volunteer-opportunities/{id}/close | NGO | Close/disable volunteer opportunity |
| GET    | /api/donor/volunteer-opportunities      | Donor | Browse all active volunteer opportunities |
| POST   | /api/donor/volunteer                    | Donor | Apply to volunteer |
| GET    | /api/donor/volunteers                   | Donor | View own volunteer applications/history |
| GET    | /api/ngo/volunteers                     | NGO   | List volunteer applications for NGO |
| PUT    | /api/ngo/volunteers/{volId}/approve     | NGO   | Approve volunteer application |
| PUT    | /api/ngo/volunteers/{volId}/complete    | NGO   | Mark volunteer work completed |

## 1 Create Volunteer Opportunity (POST /api/ngo/volunteer-opportunities)

```json
{
  "title": "Weekend Literacy Tutor",
  "description": "Teach basic reading to children in grades 3-5.",
  "location": "Community Center – Room 2",
  "startDate": "2025-09-15T09:00:00",
  "endDate":   "2025-09-15T13:00:00",
  "maxVolunteers": 10,
  "skillsRequired": ["Teaching", "Patience"],
  "linkedCampaignId": null          // or "camp123" when disaster-linked
}
```

## 2 Apply to Volunteer (POST /api/donor/volunteer)

```json
{
  "opportunityId": "opp123",
  "message": "I have prior experience tutoring at shelters.",
  "hoursCommitted": 4
}
```

## 3 Approve Volunteer (PUT /api/ngo/volunteers/{volId}/approve)

*No request body required - JWT for NGO authentication*

## 4 Complete Volunteer Work (PUT /api/ngo/volunteers/{volId}/complete)

```json
{
  "hoursDone": 4
}
```

## Typical Success Response Wrapper

```json
{
  "success": true,
  "message": "Volunteer application submitted",
  "data": {
    "volunteerId": "vol567",
    "status": "PENDING",
    "hoursCommitted": 4,
    "applicationDate": "2025-08-30T12:06:00"
  }
}
```


## NEED TO FIX
* when try to pay sometimes shows bad gateway