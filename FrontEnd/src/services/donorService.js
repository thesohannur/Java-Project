import api from './api';

// Profile management
export const getProfile = () => api.get('/donor/profile');
export const updateProfile = (payload) => api.patch('/donor/profile', payload);

// Existing functions
export const getAllApprovedCampaigns = () => api.get('/campaigns/approved');
export const getAllVolunteerOpportunities = () => api.get('/volunteer/opportunities');
export const getMyVolunteerApplications = () => api.get('/volunteer/my-applications');
export const donate = (payload) => api.post('/donations', payload);
export const applyForVolunteer = (payload) => api.post('/volunteer/apply', payload);
