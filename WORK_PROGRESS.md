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
* when try to pay sometimes shows bad gateway //its okay (90% success rate)) -tasnif


# Campaign Management System Workflow

## System Flow Overview

The campaign management system enables NGOs to create, update, and manage fundraising or volunteer campaigns, while admins review, approve, or reject them. Campaigns can require **money donations**, optionally request **volunteer time**, and can have either an **expiration date** (auto-closure) or require **manual deletion**.

---

## Step 1: NGO Creates Campaign

```
NGO logs in → Navigates to "Create Campaign" → Fills campaign details → Submits
```

### NGO Action:

* Navigate to **"Create Campaign"**
* Fill campaign details:

  * **Description**: (min 10 characters)
  * **Volunteer Time** (optional)
  * **Expiration Time** (optional)

### Example:

* Description: *"Provide food packs to flood-affected families"*
* VolunteerTime: *20 hours total*
* ExpirationTime: *2025-09-20T23:59:00*

### System Response:

```java
Campaign created with:
├── ngoEmail = currentUser.email
├── description = "Provide food packs..."
├── volunteerTime = 20
├── expirationTime = 2025-09-20T23:59:00
├── manualDeletionAllowed = false (since expirationTime provided)
├── approved = false
├── rejectFlag = 0
├── pendingCheckup = false
```

---

## Step 2: Admin Views Pending Campaigns

```
Admin logs in → Views unapproved campaigns
```

### Admin Action:

* Go to **"Unapproved Campaigns"** section
* System lists campaigns where:

  * approved = false
  * pendingCheckup = false

### System Response:

```java
GET /api/camp/allUnApproved
Returns campaigns with:
├── approved = false
└── pendingCheckup = false
```

---

## Step 3: Admin Approves or Rejects Campaign

```
Admin selects campaign → Approves or Rejects with feedback
```

### Approve:

* Admin clicks **Approve**
* System sets:

```java
approved = true
pendingCheckup = false
```

* Campaign is now visible to donors

### Reject:

* Admin clicks **Reject** and provides feedback
* Rules:

  * If campaign already approved → reject denied
  * If feedback is empty → reject denied
  * Reject flag increments each time
  * After 2 rejections → campaign deleted

### System Response (reject once):

```java
campaign.rejectFlag = 1
campaign.approved = false
campaign.pendingCheckup = true
campaign.feedback = "Description too vague"
```

### System Response (reject twice):

```java
Campaign deleted from database
Message = "Due to double refusal campaign deleted successfully"
```

---

## Step 4: NGO Updates Campaign

```
NGO logs in → Updates volunteer time / expiration → Resubmits
```

### NGO Action:

* Update fields:

  * Volunteer time (optional)
  * Expiration time (ISO date or null)
* If expiration time is set → manual deletion disabled
* If expiration time is null → manual deletion allowed

### System Response:

```java
Campaign updated:
├── volunteerTime = updated value
├── expirationTime = new ISO date OR null
├── manualDeletionAllowed = based on expirationTime
├── pendingCheckup = false
```

---

## Step 5: NGO Deletes Campaign

```
NGO logs in → Deletes campaign → System checks manual deletion flag
```

### Rules:

* If `manualDeletionAllowed = true` → NGO can delete
* If `manualDeletionAllowed = false` → deletion denied

### System Response:

```java
If allowed:
Campaign deleted successfully

If denied:
Error: "Campaign cannot be deleted. Expiry date has been set."
```

---

## Complete Status Flow

### Campaign Lifecycle:

```
CREATED → PENDING (admin review) → APPROVED → ACTIVE → COMPLETED (expired or deleted)
                ↓
             REJECTED → (updated & resubmitted) → PENDING again
                ↓
        DOUBLE REJECT → DELETED
```

### Status Meanings:

* **CREATED**: Campaign submitted by NGO
* **PENDING**: Waiting for admin review
* **APPROVED**: Campaign live for donors
* **REJECTED**: Sent back for corrections
* **ACTIVE**: Campaign in progress
* **COMPLETED**: Expired or marked finished
* **DELETED**: Removed permanently

---

## Key Features

| Campaign Rule                  | Behavior                                |
| ------------------------------ | --------------------------------------- |
| Money donation always required | No need to explicitly mention           |
| Volunteer time optional        | If set, donors can commit hours         |
| Expiration time present        | Auto-handled, manual deletion forbidden |
| Expiration time null           | NGO must manually delete                |
| Double rejection               | Campaign permanently deleted            |

---

## Database Collections

### Campaigns:

```json
{
  "campaignId": "camp123",
  "ngoEmail": "ngo@mail.com",
  "description": "Provide food packs",
  "volunteerTime": 20,
  "expirationTime": "2025-09-20T23:59:00",
  "manualDeletionAllowed": false,
  "approved": false,
  "rejectFlag": 0,
  "feedback": null,
  "pendingCheckup": false
}
```

---

## REST Endpoints & Example Payloads

| Method | Path                                  | Role  | Purpose                       |
| ------ | ------------------------------------- | ----- | ----------------------------- |
| POST   | /api/camp/createCampaign              | NGO   | Create campaign               |
| GET    | /api/camp/viewCampaign                | NGO   | View NGO’s own campaigns      |
| PUT    | /api/camp/updateCampaign/{campaignId} | NGO   | Update campaign details       |
| DELETE | /api/camp/deleteCampaign/{campaignId} | NGO   | Delete campaign if allowed    |
| GET    | /api/camp/allUnApproved               | Admin | List unapproved campaigns     |
| PUT    | /api/camp/approve-campaign/{id}       | Admin | Approve campaign              |
| PUT    | /api/camp/reject-campaign/{id}        | Admin | Reject campaign with feedback |

### 1 Create Campaign (POST /api/camp/createCampaign)

```json
{
  "description": "Provide food packs to flood victims",
  "volunteerTime": 15,
  "expirationTime": "2025-09-20T23:59:00"
}
```

### 2 Approve Campaign (PUT /api/camp/approve-campaign/{id})

*No request body required*

### 3 Reject Campaign (PUT /api/camp/reject-campaign/{id})

```json
{
  "feedback": "Please add detailed beneficiary info"
}
```

### 4 Update Campaign (PUT /api/camp/updateCampaign/{id})

```json
{
  "volunteerTime": 25,
  "expirationTime": null
}
```

### 5 Delete Campaign (DELETE /api/camp/deleteCampaign/{id})

*No request body required*

---

## Typical Success Response Wrapper

```json
{
  "success": true,
  "message": "Campaign created successfully",
  "data": {
    "campaignId": "camp567",
    "approved": false,
    "pendingCheckup": false,
    "manualDeletionAllowed": false,
    "rejectFlag": 0,
    "createdDate": "2025-09-02T12:10:00"
  }
}
```
