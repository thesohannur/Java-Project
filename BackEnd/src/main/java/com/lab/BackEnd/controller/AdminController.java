package com.lab.BackEnd.controller;

import com.lab.BackEnd.dto.request.AdminRegistrationRequest;
import com.lab.BackEnd.dto.response.ApiResponse;
import com.lab.BackEnd.model.Admin;
import com.lab.BackEnd.model.NGO;
import com.lab.BackEnd.model.Donor;
import com.lab.BackEnd.repository.AdminRepository;
import com.lab.BackEnd.repository.NGORepository;
import com.lab.BackEnd.repository.DonorRepository;
import com.lab.BackEnd.service.AdminService;
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
@RequestMapping("/api/admin")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class AdminController {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private NGORepository ngoRepository;

    @Autowired
    private DonorRepository donorRepository;

    @Autowired
    private AdminService adminService;

    // ==================== PROFILE MANAGEMENT ====================

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<Admin>> getProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        Optional<Admin> admin = adminRepository.findByEmail(email);
        if (admin.isPresent()) {
            Admin adminData = admin.get();
            adminData.setLastLogin(LocalDateTime.now());
            adminRepository.save(adminData);
            return ResponseEntity.ok(ApiResponse.success("Profile retrieved successfully", adminData));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<Admin>> updateProfile(@Valid @RequestBody AdminRegistrationRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        try {
            Admin updatedAdmin = adminService.updateAdminProfile(email, request);
            return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updatedAdmin));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to update profile: " + e.getMessage()));
        }
    }

    @PostMapping("/profile/upload-image")
    public ResponseEntity<ApiResponse<String>> uploadProfileImage(@RequestParam("image") MultipartFile image) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        try {
            String imageUrl = adminService.uploadProfileImage(email, image);
            return ResponseEntity.ok(ApiResponse.success("Profile image uploaded successfully", imageUrl));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to upload image: " + e.getMessage()));
        }
    }

    // ==================== DASHBOARD ANALYTICS ====================

    @GetMapping("/dashboard/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardStats() {
        try {
            Map<String, Object> stats = new HashMap<>();
            
            // Basic counts
            stats.put("totalNGOs", ngoRepository.count());
            stats.put("totalDonors", donorRepository.count());
            stats.put("totalAdmins", adminRepository.count());
            
            // Status-based counts
            stats.put("activeNGOs", ngoRepository.countActiveNGOs());
            stats.put("verifiedNGOs", ngoRepository.countVerifiedNGOs());
            stats.put("pendingVerificationNGOs", ngoRepository.countPendingVerificationNGOs());
            
            // Admin-specific stats
            stats.put("activeAdmins", adminRepository.countActiveAdmins());
            stats.put("superAdmins", adminRepository.countSuperAdmins());
            
            // Recent activity
            stats.put("recentNGORegistrations", ngoRepository.findRecentRegistrations(PageRequest.of(0, 5)));
            stats.put("recentAdminActivity", adminRepository.findRecentlyLoggedIn(PageRequest.of(0, 5)));
            
            return ResponseEntity.ok(ApiResponse.success("Dashboard stats retrieved successfully", stats));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve dashboard stats: " + e.getMessage()));
        }
    }

    @GetMapping("/dashboard/analytics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAnalytics(
            @RequestParam(defaultValue = "30") int days) {
        try {
            Map<String, Object> analytics = adminService.getSystemAnalytics(days);
            return ResponseEntity.ok(ApiResponse.success("Analytics retrieved successfully", analytics));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve analytics: " + e.getMessage()));
        }
    }

    // ==================== NGO MANAGEMENT ====================

    @GetMapping("/ngos")
    public ResponseEntity<ApiResponse<Page<NGO>>> getAllNGOs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "registrationDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String verificationStatus) {
        
        try {
            Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                       Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
            Pageable pageable = PageRequest.of(page, size, sort);
            
            Page<NGO> ngos;
            if (status != null && verificationStatus != null) {
                ngos = ngoRepository.findByStatusAndVerificationStatus(status, verificationStatus, pageable);
            } else if (status != null) {
                ngos = ngoRepository.findByStatus(status, pageable);
            } else if (verificationStatus != null) {
                ngos = ngoRepository.findByVerificationStatus(verificationStatus, pageable);
            } else {
                ngos = ngoRepository.findAll(pageable);
            }
            
            return ResponseEntity.ok(ApiResponse.success("NGOs retrieved successfully", ngos));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve NGOs: " + e.getMessage()));
        }
    }

    @GetMapping("/ngos/search")
    public ResponseEntity<ApiResponse<Page<NGO>>> searchNGOs(
            @RequestParam String searchTerm,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<NGO> ngos = ngoRepository.searchNGOs(searchTerm, pageable);
            return ResponseEntity.ok(ApiResponse.success("NGO search results retrieved successfully", ngos));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to search NGOs: " + e.getMessage()));
        }
    }

    @GetMapping("/ngos/{ngoId}")
    public ResponseEntity<ApiResponse<NGO>> getNGODetails(@PathVariable String ngoId) {
        try {
            Optional<NGO> ngo = ngoRepository.findByNgoId(ngoId);
            if (ngo.isPresent()) {
                return ResponseEntity.ok(ApiResponse.success("NGO details retrieved successfully", ngo.get()));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve NGO details: " + e.getMessage()));
        }
    }

    @PutMapping("/ngos/{ngoId}/verify")
    public ResponseEntity<ApiResponse<NGO>> verifyNGO(
            @PathVariable String ngoId,
            @RequestParam(required = false) String notes) {
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String adminEmail = authentication.getName();
        
        try {
            NGO verifiedNGO = adminService.verifyNGO(ngoId, adminEmail, notes);
            return ResponseEntity.ok(ApiResponse.success("NGO verified successfully", verifiedNGO));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to verify NGO: " + e.getMessage()));
        }
    }

    @PutMapping("/ngos/{ngoId}/reject")
    public ResponseEntity<ApiResponse<NGO>> rejectNGO(
            @PathVariable String ngoId,
            @RequestParam String reason) {
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String adminEmail = authentication.getName();
        
        try {
            NGO rejectedNGO = adminService.rejectNGO(ngoId, adminEmail, reason);
            return ResponseEntity.ok(ApiResponse.success("NGO rejected successfully", rejectedNGO));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to reject NGO: " + e.getMessage()));
        }
    }

    @PutMapping("/ngos/{ngoId}/status")
    public ResponseEntity<ApiResponse<NGO>> updateNGOStatus(
            @PathVariable String ngoId,
            @RequestParam String status) {
        
        try {
            NGO updatedNGO = adminService.updateNGOStatus(ngoId, status);
            return ResponseEntity.ok(ApiResponse.success("NGO status updated successfully", updatedNGO));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to update NGO status: " + e.getMessage()));
        }
    }

    // ==================== DONOR MANAGEMENT ====================

    @GetMapping("/donors")
    public ResponseEntity<ApiResponse<Page<Donor>>> getAllDonors(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "registrationDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        try {
            Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                       Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
            Pageable pageable = PageRequest.of(page, size, sort);
            
            Page<Donor> donors = donorRepository.findAll(pageable);
            return ResponseEntity.ok(ApiResponse.success("Donors retrieved successfully", donors));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve donors: " + e.getMessage()));
        }
    }

    @GetMapping("/donors/search")
    public ResponseEntity<ApiResponse<Page<Donor>>> searchDonors(
            @RequestParam String searchTerm,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Donor> donors = donorRepository.searchDonors(searchTerm, pageable);
            return ResponseEntity.ok(ApiResponse.success("Donor search results retrieved successfully", donors));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to search donors: " + e.getMessage()));
        }
    }

    @GetMapping("/donors/{donorId}")
    public ResponseEntity<ApiResponse<Donor>> getDonorDetails(@PathVariable String donorId) {
        try {
            Optional<Donor> donor = donorRepository.findByDonorId(donorId);
            if (donor.isPresent()) {
                return ResponseEntity.ok(ApiResponse.success("Donor details retrieved successfully", donor.get()));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve donor details: " + e.getMessage()));
        }
    }

    @PutMapping("/donors/{donorId}/verify")
    public ResponseEntity<ApiResponse<Donor>> verifyDonor(@PathVariable String donorId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String adminEmail = authentication.getName();
        
        try {
            Donor verifiedDonor = adminService.verifyDonor(donorId, adminEmail);
            return ResponseEntity.ok(ApiResponse.success("Donor verified successfully", verifiedDonor));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to verify donor: " + e.getMessage()));
        }
    }

    // ==================== ADMIN MANAGEMENT ====================

    @GetMapping("/admins")
    public ResponseEntity<ApiResponse<Page<Admin>>> getAllAdmins(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "registrationDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) String adminLevel,
            @RequestParam(required = false) String department) {
        
        try {
            Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                       Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
            Pageable pageable = PageRequest.of(page, size, sort);
            
            Page<Admin> admins;
            if (adminLevel != null && department != null) {
                admins = adminRepository.findByAdminLevelAndDepartment(adminLevel, department, pageable);
            } else if (adminLevel != null) {
                admins = adminRepository.findByAdminLevel(adminLevel, pageable);
            } else if (department != null) {
                admins = adminRepository.findByDepartment(department, pageable);
            } else {
                admins = adminRepository.findAll(pageable);
            }
            
            return ResponseEntity.ok(ApiResponse.success("Admins retrieved successfully", admins));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve admins: " + e.getMessage()));
        }
    }

    @PostMapping("/admins")
    public ResponseEntity<ApiResponse<Admin>> createAdmin(@Valid @RequestBody AdminRegistrationRequest request) {
        try {
            Admin newAdmin = adminService.createAdmin(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Admin created successfully", newAdmin));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to create admin: " + e.getMessage()));
        }
    }

    @PutMapping("/admins/{adminId}")
    public ResponseEntity<ApiResponse<Admin>> updateAdmin(
            @PathVariable String adminId,
            @Valid @RequestBody AdminRegistrationRequest request) {
        
        try {
            Admin updatedAdmin = adminService.updateAdmin(adminId, request);
            return ResponseEntity.ok(ApiResponse.success("Admin updated successfully", updatedAdmin));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to update admin: " + e.getMessage()));
        }
    }

    @PutMapping("/admins/{adminId}/status")
    public ResponseEntity<ApiResponse<Admin>> updateAdminStatus(
            @PathVariable String adminId,
            @RequestParam Boolean isActive) {
        
        try {
            Admin updatedAdmin = adminService.updateAdminStatus(adminId, isActive);
            return ResponseEntity.ok(ApiResponse.success("Admin status updated successfully", updatedAdmin));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to update admin status: " + e.getMessage()));
        }
    }

    @DeleteMapping("/admins/{adminId}")
    public ResponseEntity<ApiResponse<String>> deleteAdmin(@PathVariable String adminId) {
        try {
            adminService.deleteAdmin(adminId);
            return ResponseEntity.ok(ApiResponse.success("Admin deleted successfully", adminId));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to delete admin: " + e.getMessage()));
        }
    }

    // ==================== REPORTS AND ANALYTICS ====================

    @GetMapping("/reports/ngo-statistics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getNGOStatistics() {
        try {
            Map<String, Object> stats = adminService.getNGOStatistics();
            return ResponseEntity.ok(ApiResponse.success("NGO statistics retrieved successfully", stats));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve NGO statistics: " + e.getMessage()));
        }
    }

    @GetMapping("/reports/donor-statistics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDonorStatistics() {
        try {
            Map<String, Object> stats = adminService.getDonorStatistics();
            return ResponseEntity.ok(ApiResponse.success("Donor statistics retrieved successfully", stats));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve donor statistics: " + e.getMessage()));
        }
    }

    @GetMapping("/reports/admin-performance")
    public ResponseEntity<ApiResponse<List<Object>>> getAdminPerformance() {
        try {
            List<Object> performance = adminService.getAdminPerformanceReport();
            return ResponseEntity.ok(ApiResponse.success("Admin performance report retrieved successfully", performance));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve admin performance: " + e.getMessage()));
        }
    }

    @GetMapping("/reports/system-health")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getSystemHealth() {
        try {
            Map<String, Object> health = adminService.getSystemHealthReport();
            return ResponseEntity.ok(ApiResponse.success("System health report retrieved successfully", health));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve system health: " + e.getMessage()));
        }
    }

    // ==================== SYSTEM SETTINGS ====================

    @GetMapping("/settings")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getSystemSettings() {
        try {
            Map<String, Object> settings = adminService.getSystemSettings();
            return ResponseEntity.ok(ApiResponse.success("System settings retrieved successfully", settings));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve system settings: " + e.getMessage()));
        }
    }

    @PutMapping("/settings")
    public ResponseEntity<ApiResponse<Map<String, Object>>> updateSystemSettings(
            @RequestBody Map<String, Object> settings) {
        
        try {
            Map<String, Object> updatedSettings = adminService.updateSystemSettings(settings);
            return ResponseEntity.ok(ApiResponse.success("System settings updated successfully", updatedSettings));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to update system settings: " + e.getMessage()));
        }
    }

    // ==================== ACTIVITY LOGS ====================

    @GetMapping("/activity-logs")
    public ResponseEntity<ApiResponse<Page<Object>>> getActivityLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String adminId,
            @RequestParam(required = false) String action) {
        
        try {
            Pageable pageable = PageRequest.of(page, size, Sort.by("timestamp").descending());
            Page<Object> logs = adminService.getActivityLogs(adminId, action, pageable);
            return ResponseEntity.ok(ApiResponse.success("Activity logs retrieved successfully", logs));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve activity logs: " + e.getMessage()));
        }
    }

    // ==================== BULK OPERATIONS ====================

    @PostMapping("/bulk/verify-ngos")
    public ResponseEntity<ApiResponse<Map<String, Object>>> bulkVerifyNGOs(
            @RequestBody List<String> ngoIds) {
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String adminEmail = authentication.getName();
        
        try {
            Map<String, Object> result = adminService.bulkVerifyNGOs(ngoIds, adminEmail);
            return ResponseEntity.ok(ApiResponse.success("Bulk NGO verification completed", result));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to perform bulk verification: " + e.getMessage()));
        }
    }

    @PostMapping("/bulk/send-notifications")
    public ResponseEntity<ApiResponse<Map<String, Object>>> sendBulkNotifications(
            @RequestParam String userType,
            @RequestParam String message,
            @RequestBody(required = false) List<String> userIds) {
        
        try {
            Map<String, Object> result = adminService.sendBulkNotifications(userType, message, userIds);
            return ResponseEntity.ok(ApiResponse.success("Bulk notifications sent successfully", result));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to send bulk notifications: " + e.getMessage()));
        }
    }

    // ==================== EXCEPTION HANDLING ====================

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<String>> handleException(Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("An unexpected error occurred: " + e.getMessage()));
    }
}
