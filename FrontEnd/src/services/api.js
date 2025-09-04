import axios from 'axios';

// Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add authentication token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add request timestamp for debugging
    config.metadata = { startTime: new Date() };
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and responses
api.interceptors.response.use(
  (response) => {
    // Calculate request duration
    const endTime = new Date();
    const duration = endTime - response.config.metadata.startTime;
    console.log(`API Request to ${response.config.url} took ${duration}ms`);
    
    return response;
  },
  (error) => {
    // Handle different error scenarios
    if (error.response?.status === 401) {
      // Unauthorized - clear tokens and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      localStorage.removeItem('userData');
      
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/auth') && !window.location.pathname.includes('/login')) {
        window.location.href = '/auth';
      }
    } else if (error.response?.status === 403) {
      // Forbidden - insufficient permissions
      console.error('Access forbidden - insufficient permissions');
    } else if (error.response?.status >= 500) {
      // Server errors
      console.error('Server error occurred:', error.response?.data?.message);
    } else if (error.code === 'ECONNABORTED') {
      // Timeout error
      console.error('Request timeout');
    } else if (!error.response) {
      // Network error
      console.error('Network error - server may be down');
    }
    
    return Promise.reject(error);
  }
);

// Authentication APIs
export const authAPI = {
  // Login for all user types
  login: (loginData) => api.post('/auth/login', loginData),
  
  // Registration endpoints
  registerDonor: (donorData) => api.post('/auth/register-donor', donorData),
  registerNGO: (ngoData) => api.post('/auth/register-ngo', ngoData),
  registerAdmin: (adminData) => api.post('/auth/register-admin', adminData),
  
  // Token verification
  verifyToken: () => api.get('/auth/verify'),
  
  // Password management
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, newPassword) => api.post('/auth/reset-password', { token, newPassword }),
  changePassword: (oldPassword, newPassword) => api.put('/auth/change-password', { oldPassword, newPassword }),
  
  // Logout
  logout: () => api.post('/auth/logout'),
};

// Profile APIs for all user types
export const profileAPI = {
  // Donor profile
  getDonorProfile: () => api.get('/donor/profile'),
  updateDonorProfile: (profileData) => api.put('/donor/profile', profileData),
  
  // NGO profile
  getNGOProfile: () => api.get('/ngo/profile'),
  updateNGOProfile: (profileData) => api.put('/ngo/profile', profileData),
  
  // Admin profile
  getAdminProfile: () => api.get('/admin/profile'),
  updateAdminProfile: (profileData) => api.put('/admin/profile', profileData),
  
  // Profile image upload
  uploadProfileImage: (file, userType) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post(`/${userType}/profile/upload-image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
};

// Donor-specific APIs
export const donorAPI = {
  // Profile management
  getProfile: () => api.get('/donor/profile'),
  updateProfile: (profileData) => api.put('/donor/profile', profileData),
  
  // Dashboard data
  getDashboardStats: () => api.get('/donor/dashboard/stats'),
  getRecentActivity: () => api.get('/donor/dashboard/recent-activity'),
  getDonationHistory: (page = 0, size = 10) => api.get(`/donor/donations?page=${page}&size=${size}`),
  
  // Donation management
  checkEligibility: () => api.get('/donor/eligibility'),
  requestDonation: (requestData = {}) => {
    const defaultRequest = {
      requestDate: new Date().toISOString(),
      notes: 'Dashboard request',
      ...requestData
    };
    return api.post('/donor/dashboard/donation-request', defaultRequest);
  },
  makeDonation: (donationData) => api.post('/donor/donate', donationData),
  
  // NGO interaction
  searchNGOs: (searchTerm, filters = {}) => api.get('/donor/ngos/search', { 
    params: { searchTerm, ...filters } 
  }),
  getNGODetails: (ngoId) => api.get(`/donor/ngos/${ngoId}`),
  followNGO: (ngoId) => api.post(`/donor/ngos/${ngoId}/follow`),
  unfollowNGO: (ngoId) => api.delete(`/donor/ngos/${ngoId}/follow`),
  
  // Settings
  updateSettings: (settings) => api.put('/donor/settings', settings),
  updateNotificationPreferences: (preferences) => api.put('/donor/settings/notifications', preferences),
};

// NGO-specific APIs
export const ngoAPI = {
  // Profile management
  getProfile: () => api.get('/ngo/profile'),
  updateProfile: (profileData) => api.put('/ngo/profile', profileData),
  
  // Dashboard data
  getDashboardStats: () => api.get('/ngo/dashboard/stats'),
  getRecentActivities: () => api.get('/ngo/dashboard/activities'),
  getCategoryDonations: () => api.get('/ngo/dashboard/donations/category'),
  getPerformanceAnalytics: (days = 30) => api.get(`/ngo/analytics/performance?days=${days}`),
  
  // Verification management
  getVerificationStatus: () => api.get('/ngo/verification/status'),
  submitVerificationDocuments: (documents) => {
    const formData = new FormData();
    documents.forEach((doc, index) => {
      formData.append(`documents`, doc);
    });
    return api.post('/ngo/verification/submit', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  // Campaign management
  getCampaigns: (page = 0, size = 10) => api.get(`/ngo/campaigns?page=${page}&size=${size}`),
  createCampaign: (campaignData) => api.post('/ngo/campaigns', campaignData),
  updateCampaign: (campaignId, campaignData) => api.put(`/ngo/campaigns/${campaignId}`, campaignData),
  deleteCampaign: (campaignId) => api.delete(`/ngo/campaigns/${campaignId}`),
  
  // Goal management
  updateMonthlyGoal: (monthlyGoal) => api.put(`/ngo/goals/monthly?monthlyGoal=${monthlyGoal}`),
  
  // Settings
  updateNotificationSettings: (emailNotifications, smsNotifications) => 
    api.put(`/ngo/settings/notifications?emailNotifications=${emailNotifications}&smsNotifications=${smsNotifications}`),
  updatePreferences: (preferredLanguage, timezone) => 
    api.put(`/ngo/settings/preferences?preferredLanguage=${preferredLanguage}&timezone=${timezone}`),
  
  // File uploads
  uploadLogo: (logoFile) => {
    const formData = new FormData();
    formData.append('logo', logoFile);
    return api.post('/ngo/upload/logo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
};

// Admin-specific APIs
export const adminAPI = {
  // Profile management
  getProfile: () => api.get('/admin/profile'),
  updateProfile: (profileData) => api.put('/admin/profile', profileData),
  
  // Dashboard analytics
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
  getAnalytics: (days = 30) => api.get(`/admin/dashboard/analytics?days=${days}`),
  
  // NGO management
  getAllNGOs: (page = 0, size = 10, sortBy = 'registrationDate', sortDir = 'desc', filters = {}) => 
    api.get('/admin/ngos', { params: { page, size, sortBy, sortDir, ...filters } }),
  searchNGOs: (searchTerm, page = 0, size = 10) => 
    api.get('/admin/ngos/search', { params: { searchTerm, page, size } }),
  getNGODetails: (ngoId) => api.get(`/admin/ngos/${ngoId}`),
  verifyNGO: (ngoId, notes = '') => api.put(`/admin/ngos/${ngoId}/verify`, null, { params: { notes } }),
  rejectNGO: (ngoId, reason) => api.put(`/admin/ngos/${ngoId}/reject`, null, { params: { reason } }),
  updateNGOStatus: (ngoId, status) => api.put(`/admin/ngos/${ngoId}/status`, null, { params: { status } }),
  
  // Donor management
  getAllDonors: (page = 0, size = 10, sortBy = 'registrationDate', sortDir = 'desc') => 
    api.get('/admin/donors', { params: { page, size, sortBy, sortDir } }),
  searchDonors: (searchTerm, page = 0, size = 10) => 
    api.get('/admin/donors/search', { params: { searchTerm, page, size } }),
  getDonorDetails: (donorId) => api.get(`/admin/donors/${donorId}`),
  verifyDonor: (donorId) => api.put(`/admin/donors/${donorId}/verify`),
  
  // Admin management
  getAllAdmins: (page = 0, size = 10, sortBy = 'registrationDate', sortDir = 'desc', filters = {}) => 
    api.get('/admin/admins', { params: { page, size, sortBy, sortDir, ...filters } }),
  createAdmin: (adminData) => api.post('/admin/admins', adminData),
  updateAdmin: (adminId, adminData) => api.put(`/admin/admins/${adminId}`, adminData),
  updateAdminStatus: (adminId, isActive) => api.put(`/admin/admins/${adminId}/status`, null, { params: { isActive } }),
  deleteAdmin: (adminId) => api.delete(`/admin/admins/${adminId}`),
  
  // Reports and analytics
  getNGOStatistics: () => api.get('/admin/reports/ngo-statistics'),
  getDonorStatistics: () => api.get('/admin/reports/donor-statistics'),
  getAdminPerformance: () => api.get('/admin/reports/admin-performance'),
  getSystemHealth: () => api.get('/admin/reports/system-health'),
  
  // System settings
  getSystemSettings: () => api.get('/admin/settings'),
  updateSystemSettings: (settings) => api.put('/admin/settings', settings),
  
  // Activity logs
  getActivityLogs: (page = 0, size = 20, adminId = null, action = null) => 
    api.get('/admin/activity-logs', { params: { page, size, adminId, action } }),
  
  // Bulk operations
  bulkVerifyNGOs: (ngoIds) => api.post('/admin/bulk/verify-ngos', ngoIds),
  sendBulkNotifications: (userType, message, userIds = null) => 
    api.post('/admin/bulk/send-notifications', userIds, { params: { userType, message } }),
};

// General dashboard APIs
export const dashboardAPI = {
  // Common dashboard data
  getStats: (userType) => api.get(`/${userType}/dashboard/stats`),
  getRecentActivity: (userType) => api.get(`/${userType}/dashboard/recent-activity`),
  
  // Notifications
  getNotifications: (page = 0, size = 10) => api.get('/notifications', { params: { page, size } }),
  markNotificationAsRead: (notificationId) => api.put(`/notifications/${notificationId}/read`),
  markAllNotificationsAsRead: () => api.put('/notifications/mark-all-read'),
  
  // Search functionality
  globalSearch: (searchTerm, type = 'all') => api.get('/search', { params: { q: searchTerm, type } }),
};

// File upload utilities
export const fileAPI = {
  uploadFile: (file, endpoint, additionalData = {}) => {
    const formData = new FormData();
    formData.append('file', file);
    
    Object.keys(additionalData).forEach(key => {
      formData.append(key, additionalData[key]);
    });
    
    return api.post(endpoint, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        console.log(`Upload Progress: ${percentCompleted}%`);
      }
    });
  },
  
  uploadMultipleFiles: (files, endpoint) => {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`files`, file);
    });
    
    return api.post(endpoint, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
};

// Utility functions for API responses
export const apiUtils = {
  // Extract data from API response
  extractData: (response) => {
    if (response?.data?.data !== undefined) {
      return response.data.data;
    }
    return response?.data || response;
  },
  
  // Check if API response is successful
  isSuccess: (response) => {
    return response?.data?.success !== false && response?.status >= 200 && response?.status < 300;
  },
  
  // Get error message from API response
  getErrorMessage: (error) => {
    if (error?.response?.data?.message) {
      return error.response.data.message;
    }
    if (error?.response?.data?.error) {
      return error.response.data.error;
    }
    if (error?.message) {
      return error.message;
    }
    if (error?.response?.status) {
      switch (error.response.status) {
        case 400:
          return 'Bad request - please check your input';
        case 401:
          return 'Unauthorized - please login again';
        case 403:
          return 'Access forbidden - insufficient permissions';
        case 404:
          return 'Resource not found';
        case 500:
          return 'Server error - please try again later';
        default:
          return `HTTP Error ${error.response.status}`;
      }
    }
    return 'An unexpected error occurred';
  },
  
  // Handle API errors consistently
  handleError: (error, customMessage = null) => {
    const errorMessage = customMessage || apiUtils.getErrorMessage(error);
    console.error('API Error:', {
      message: errorMessage,
      status: error?.response?.status,
      data: error?.response?.data,
      config: error?.config
    });
    
    // You can add toast notifications or other error handling here
    // For example: toast.error(errorMessage);
    
    throw new Error(errorMessage);
  },
  
  // Format API response for consistent handling
  formatResponse: (response) => {
    return {
      success: apiUtils.isSuccess(response),
      data: apiUtils.extractData(response),
      message: response?.data?.message || 'Success',
      status: response?.status
    };
  },
  
  // Retry failed requests
  retryRequest: async (requestFn, maxRetries = 3, delay = 1000) => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await requestFn();
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        
        // Don't retry on client errors (4xx)
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          throw error;
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
      }
    }
  }
};

// Combined API object for easy access
export const API = {
  auth: authAPI,
  profile: profileAPI,
  dashboard: dashboardAPI,
  donor: donorAPI,
  ngo: ngoAPI,
  admin: adminAPI,
  file: fileAPI,
  utils: apiUtils,
};

// Export the axios instance for direct use if needed
export default api;

// Export configuration for external use
export const config = {
  baseURL: API_BASE_URL,
  timeout: 30000,
};
