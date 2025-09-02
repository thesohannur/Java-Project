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


# Campaign Management System Workflow

## System Flow Overview

The **Campaign Management System** enables NGOs to create, update, and manage fundraising or volunteer-related campaigns. Admins oversee approvals/rejections, while donors can view only approved campaigns. The system also supports automated cleanup of expired campaigns. In case of double rejection of campaign by admin the campaign will got deleted automatically.

---

## Step 1: NGO Creates Campaign

```
NGO logs in → Creates Campaign → Sets details
```

### NGO Action:

* Navigate to **"Create Campaign"**
* Provide details:

  * **Description** (≥ 10 characters, required)
  * **Volunteer Time** (optional)
  * **Expiration Time** (optional, ISO format)

### System Response:

```java
Campaign created with:
├── ngoEmail = loggedInUserEmail
├── expirationTime = null or providedDate
├── volunteerTime = optional
├── approved = false
├── pendingCheckup = false
├── manualDeletionAllowed = true if expirationTime == null
└── status = CREATED
```

---

## Step 2: NGO Views and Updates Campaigns

```
NGO logs in → Views own campaigns → Updates as needed
```

### NGO Action:

* View campaigns with **GET /api/camp/viewCampaign**
* Update campaign with **PUT /api/camp/updateCampaign/{id}**

  * Can change volunteerTime
  * Can set/remove expirationTime
  * Reset `pendingCheckup` flag

### System Response:

```java
If updated:
├── volunteerTime = updated value
├── expirationTime = new date or null
├── manualDeletionAllowed = false if expirationTime set
├── pendingCheckup = false
└── campaign saved
```

---

## Step 3: Admin Reviews Campaigns

```
Admin logs in → Sees unapproved campaigns → Approves or Rejects
```

### Admin Action:

* View pending campaigns via **GET /api/camp/allUnApproved**
* Approve campaign with **PUT /api/camp/approve-campaign/{id}**
* Reject campaign with **PUT /api/camp/reject-campaign/{id}** (with feedback)

### System Response:

```java
If APPROVED:
├── campaign.approved = true
└── campaign saved

If REJECTED:
├── campaign.rejectFlag += 1
├── campaign.feedback = feedback message
├── campaign.pendingCheckup = true
├── if rejectFlag >= 2 → campaign deleted
└── campaign saved
```

---

## Step 4: Donors Browse Campaigns

```
Donor logs in → Views approved campaigns
```

### Donor Action:

* Click **"All Approved Campaigns"**
* Browse list of active campaigns

### System Response:

```java
GET /api/camp/allApproved
Returns list where:
├── approved = true
└── not expired
```

---

## Step 5: NGO Deletes Campaign

```
NGO requests deletion → System checks rules
```

### NGO Action:

* Call **DELETE /api/camp/deleteCampaign/{id}**

### System Response:

```java
If expirationTime == null:
├── manualDeletionAllowed = true
├── campaign deleted
└── message = "Campaign deleted successfully"

If expirationTime != null:
└── manual deletion not allowed → 403 Forbidden
```

---

## Step 6: System Auto-Deletes Expired Campaigns

```
System scheduler runs daily at midnight
```

### Automated Action:

* Job checks all campaigns
* Deletes expired ones

### System Response:

```java
If LocalDateTime.now() > expirationTime:
├── campaign removed from DB
└── console log "Deleted expired campaign: {description}"
```

---

## Complete Status Flow

### Campaign Lifecycle:

```
CREATED → PENDING → APPROVED → ACTIVE → EXPIRED (auto-deletion)
          ↓
        REJECTED (→ deleted after 2nd rejection)
```

### Status Meanings:

* **CREATED**: NGO created campaign, awaiting admin approval
* **PENDING**: Waiting for admin review
* **APPROVED**: Admin accepted the campaign
* **REJECTED**: Campaign rejected (deleted after 2 rejections)
* **ACTIVE**: Approved and visible to donors
* **EXPIRED**: Auto-deleted by scheduler after expiration date

---

## Key Differences from Volunteer (Time Donation)

| Volunteer System                                      | Campaign System                                        |
| ----------------------------------------------------- | ------------------------------------------------------ |
| Requires NGO approval of donor applications           | Requires Admin approval of campaigns                   |
| Volunteer slots limit participation                   | No limit on donations                                  |
| Status: PENDING → APPROVED → IN\_PROGRESS → COMPLETED | Status: CREATED → APPROVED/REJECTED → ACTIVE → EXPIRED |
| Donors donate time & skills                           | Donors contribute money (and optional volunteer time)  |
| Manual + real-world coordination                      | Mostly system + admin-driven                           |

---

## Frontend User Experience

### For NGOs:

```
Dashboard
├── Create Campaign
├── View Campaigns
├── Update Campaign
└── Delete Campaign (if allowed)
```

### For Admins:

```
Dashboard
├── View Unapproved Campaigns
├── Approve Campaign
└── Reject Campaign (with feedback)
```

### For Donors:

```
Dashboard
└── Browse Approved Campaigns
```

---

## Database Collections

### Campaigns:

```
campaigns: [
  { campaignId, ngoEmail, description, expirationTime, volunteerTime, 
    approved, rejectFlag, feedback, pendingCheckup, manualDeletionAllowed }
]
```

---

## REST Endpoints & Example Payloads

| Method | Path                            | Role  | Purpose                                 |
| ------ | ------------------------------- | ----- | --------------------------------------- |
| POST   | /api/camp/createCampaign        | NGO   | Create a new campaign                   |
| GET    | /api/camp/viewCampaign          | NGO   | View campaigns created by logged-in NGO |
| PUT    | /api/camp/updateCampaign/{id}   | NGO   | Update campaign details                 |
| DELETE | /api/camp/deleteCampaign/{id}   | NGO   | Delete campaign (if allowed)            |
| GET    | /api/camp/allUnApproved         | Admin | Browse unapproved campaigns             |
| PUT    | /api/camp/approve-campaign/{id} | Admin | Approve a campaign                      |
| PUT    | /api/camp/reject-campaign/{id}  | Admin | Reject campaign (with feedback)         |
| GET    | /api/camp/allApproved           | Donor | Browse approved campaigns               |

---

## 1 Create Campaign (POST /api/camp/createCampaign)

```json
{
  "description": "Flood relief fund for rural areas",
  "expirationTime": "2025-09-30T23:59:00",
  "volunteerTime": 20
}
```

## 2 Update Campaign (PUT /api/camp/updateCampaign/{id})

```json
{
  "volunteerTime": 15,
  "expirationTime": "2025-10-10T23:59:00"
}
```

## 3 Reject Campaign (PUT /api/camp/reject-campaign/{id})

```json
"Feedback: Campaign lacks detailed plan."
```

## 4 Delete Campaign (DELETE /api/camp/deleteCampaign/{id})

*No request body required*

## Typical Success Response Wrapper

```json
{
  "success": true,
  "message": "Campaign updated successfully",
  "data": {
    "campaignId": "camp123",
    "status": "APPROVED",
    "expirationTime": "2025-09-30T23:59:00",
    "manualDeletionAllowed": false
  }
}
```

---
