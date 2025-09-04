package com.lab.BackEnd.controller;

import com.lab.BackEnd.dto.request.NGORegistrationRequest;
import com.lab.BackEnd.dto.response.ApiResponse;
import com.lab.BackEnd.model.NGO;
import com.lab.BackEnd.repository.NGORepository;
import com.lab.BackEnd.service.NGOService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/ngo")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class NGOController {

    @Autowired
    private NGORepository ngoRepository;

    @Autowired
    private NGOService ngoService;

    // Dashboard Profile Management
    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<NGO>> getProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        Optional<NGO> ngo = ngoRepository.findByEmail(email);
        if (ngo.isPresent()) {
            return ResponseEntity.ok(ApiResponse.success("Profile retrieved successfully", ngo.get()));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<NGO>> updateProfile(@Valid @RequestBody NGORegistrationRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        try {
            NGO updatedNGO = ngoService.updateNGOProfile(email, request);
            return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updatedNGO));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to update profile: " + e.getMessage()));
        }
    }

    // Dashboard Statistics and Analytics
    @GetMapping("/dashboard/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardStats() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        Optional<NGO> ngoOpt = ngoRepository.findByEmail(email);
        if (ngoOpt.isPresent()) {
            NGO ngo = ngoOpt.get();
            Map<String, Object> stats = new HashMap<>();
            
            stats.put("totalReceived", ngo.getTotalReceived());
            stats.put("totalDonors", ngo.getTotalDonors());
            stats.put("activeCampaigns", ngo.getActiveCampaigns());
            stats.put("completedProjects", ngo.getCompletedProjects());
            stats.put("monthlyGoal", ngo.getMonthlyGoal());
            stats.put("currentMonthReceived", ngo.getCurrentMonthReceived());
            stats.put("impactScore", ngo.getImpactScore());
            stats.put("beneficiariesReached", ngo.getBeneficiariesReached());
            stats.put("verificationStatus", ngo.getVerificationStatus());
            stats.put("isVerified", ngo.isVerified());
            
            // Calculate goal progress percentage
            if (ngo.getMonthlyGoal() != null && ngo.getMonthlyGoal() > 0) {
                double progress = (ngo.getCurrentMonthReceived() / ngo.getMonthlyGoal()) * 100;
                stats.put("goalProgress", Math.min(progress, 100.0));
            } else {
                stats.put("goalProgress", 0.0);
            }

            return ResponseEntity.ok(ApiResponse.success("Dashboard stats retrieved successfully", stats));
        }
        return ResponseEntity.notFound().build();
    }

    // Recent Activities
    @GetMapping("/dashboard/activities")
    public ResponseEntity<ApiResponse<List<String>>> getRecentActivities() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        Optional<NGO> ngo = ngoRepository.findByEmail(email);
        if (ngo.isPresent()) {
            List<String> activities = ngo.get().getRecentActivities();
            return ResponseEntity.ok(ApiResponse.success("Recent activities retrieved successfully", activities));
        }
        return ResponseEntity.notFound().build();
    }

    // Category-wise Donations
    @GetMapping("/dashboard/donations/category")
    public ResponseEntity<ApiResponse<Map<String, Double>>> getCategoryWiseDonations() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        Optional<NGO> ngo = ngoRepository.findByEmail(email);
        if (ngo.isPresent()) {
            Map<String, Double> categoryDonations = ngo.get().getCategoryWiseDonations();
            return ResponseEntity.ok(ApiResponse.success("Category-wise donations retrieved successfully", categoryDonations));
        }
        return ResponseEntity.notFound().build();
    }

    // NGO Search and Filtering (for admin dashboard)
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<NGO>>> searchNGOs(
            @RequestParam(required = false) String searchTerm,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String country,
            @RequestParam(required = false) String focusArea,
            @RequestParam(required = false) Boolean isVerified) {
        
        try {
            List<NGO> ngos = ngoService.searchNGOs(searchTerm, status, country, focusArea, isVerified);
            return ResponseEntity.ok(ApiResponse.success("NGOs retrieved successfully", ngos));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Search failed: " + e.getMessage()));
        }
    }

    // Verification Management
    @PostMapping("/verification/submit")
    public ResponseEntity<ApiResponse<String>> submitVerificationDocuments(
            @RequestParam("documents") List<MultipartFile> documents) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        try {
            ngoService.submitVerificationDocuments(email, documents);
            return ResponseEntity.ok(ApiResponse.success("Verification documents submitted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to submit documents: " + e.getMessage()));
        }
    }

    @GetMapping("/verification/status")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getVerificationStatus() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        Optional<NGO> ngo = ngoRepository.findByEmail(email);
        if (ngo.isPresent()) {
            Map<String, Object> verificationInfo = new HashMap<>();
            verificationInfo.put("verificationStatus", ngo.get().getVerificationStatus());
            verificationInfo.put("isVerified", ngo.get().isVerified());
            verificationInfo.put("lastVerificationDate", ngo.get().getLastVerificationDate());
            verificationInfo.put("verificationDocuments", ngo.get().getVerificationDocuments());
            
            return ResponseEntity.ok(ApiResponse.success("Verification status retrieved successfully", verificationInfo));
        }
        return ResponseEntity.notFound().build();
    }

    // Goal Management
    @PutMapping("/goals/monthly")
    public ResponseEntity<ApiResponse<NGO>> updateMonthlyGoal(@RequestParam Double monthlyGoal) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        try {
            NGO updatedNGO = ngoService.updateMonthlyGoal(email, monthlyGoal);
            return ResponseEntity.ok(ApiResponse.success("Monthly goal updated successfully", updatedNGO));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to update monthly goal: " + e.getMessage()));
        }
    }

    // Settings Management
    @PutMapping("/settings/notifications")
    public ResponseEntity<ApiResponse<NGO>> updateNotificationSettings(
            @RequestParam boolean emailNotifications,
            @RequestParam boolean smsNotifications) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        try {
            NGO updatedNGO = ngoService.updateNotificationSettings(email, emailNotifications, smsNotifications);
            return ResponseEntity.ok(ApiResponse.success("Notification settings updated successfully", updatedNGO));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to update notification settings: " + e.getMessage()));
        }
    }

    @PutMapping("/settings/preferences")
    public ResponseEntity<ApiResponse<NGO>> updatePreferences(
            @RequestParam String preferredLanguage,
            @RequestParam String timezone) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        try {
            NGO updatedNGO = ngoService.updatePreferences(email, preferredLanguage, timezone);
            return ResponseEntity.ok(ApiResponse.success("Preferences updated successfully", updatedNGO));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to update preferences: " + e.getMessage()));
        }
    }

    // File Upload for Logo and Documents
    @PostMapping("/upload/logo")
    public ResponseEntity<ApiResponse<String>> uploadLogo(@RequestParam("logo") MultipartFile logo) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        try {
            String logoUrl = ngoService.uploadLogo(email, logo);
            return ResponseEntity.ok(ApiResponse.success("Logo uploaded successfully", logoUrl));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to upload logo: " + e.getMessage()));
        }
    }

    // Performance Analytics
    @GetMapping("/analytics/performance")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getPerformanceAnalytics(
            @RequestParam(defaultValue = "30") int days) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        try {
            Map<String, Object> analytics = ngoService.getPerformanceAnalytics(email, days);
            return ResponseEntity.ok(ApiResponse.success("Performance analytics retrieved successfully", analytics));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve analytics: " + e.getMessage()));
        }
    }

    // Admin endpoints for NGO management
    @GetMapping("/admin/all")
    public ResponseEntity<ApiResponse<Page<NGO>>> getAllNGOs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "registrationDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        try {
            Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                       Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
            Pageable pageable = PageRequest.of(page, size, sort);
            
            Page<NGO> ngos = ngoRepository.findAll(pageable);
            return ResponseEntity.ok(ApiResponse.success("NGOs retrieved successfully", ngos));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve NGOs: " + e.getMessage()));
        }
    }

    @PutMapping("/admin/{ngoId}/verify")
    public ResponseEntity<ApiResponse<NGO>> verifyNGO(@PathVariable String ngoId) {
        try {
            NGO verifiedNGO = ngoService.verifyNGO(ngoId);
            return ResponseEntity.ok(ApiResponse.success("NGO verified successfully", verifiedNGO));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to verify NGO: " + e.getMessage()));
        }
    }

    @PutMapping("/admin/{ngoId}/status")
    public ResponseEntity<ApiResponse<NGO>> updateNGOStatus(
            @PathVariable String ngoId,
            @RequestParam String status) {
        try {
            NGO updatedNGO = ngoService.updateNGOStatus(ngoId, status);
            return ResponseEntity.ok(ApiResponse.success("NGO status updated successfully", updatedNGO));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to update NGO status: " + e.getMessage()));
        }
    }

    // Dashboard Summary for Admin
    @GetMapping("/admin/dashboard/summary")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAdminDashboardSummary() {
        try {
            Map<String, Object> summary = new HashMap<>();
            summary.put("totalNGOs", ngoRepository.count());
            summary.put("activeNGOs", ngoRepository.countActiveNGOs());
            summary.put("verifiedNGOs", ngoRepository.countVerifiedNGOs());
            summary.put("pendingVerification", ngoRepository.countPendingVerificationNGOs());
            summary.put("recentRegistrations", ngoRepository.findRecentRegistrations());
            
            return ResponseEntity.ok(ApiResponse.success("Admin dashboard summary retrieved successfully", summary));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve dashboard summary: " + e.getMessage()));
        }
    }

    // Exception handling
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<String>> handleException(Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("An unexpected error occurred: " + e.getMessage()));
    }
}
